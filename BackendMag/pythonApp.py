import flask
import json
import csv
import pandas as pd
from sklearn import preprocessing
import sys
import pickle
import numpy as np
import math
from operator import itemgetter, attrgetter
import base64

app = flask.Flask(__name__)
app.config["DEBUG"] = True

photos = []
for line in open(r'C:\Users\Adis\Downloads\photos\yelp_photos\photos.json', encoding="utf8"):
    photos.append(json.loads(line))

df_business = pd.read_csv (r'C:\Users\Adis\Desktop\dataset/restaurants.csv')
boston_business = []
for i in range(0,len(df_business)):
    if(df_business['city'][i] == 'Boston'):
        boston_business.append(df_business['business_id'][i])


def calculateDistance(lat1, lon1, lat2, lon2):
    p = 0.017453292519943295
    hav = 0.5 - np.cos((lat2-lat1)*p)/2 + np.cos(lat1*p)*np.cos(lat2*p) * (1-np.cos((lon2-lon1)*p)) / 2
    return 12742 * math.asin(np.sqrt(hav))

def sortFunction(value):
	return value["distance"]

@app.route('/', methods=['GET'])
def home():
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"

@app.route('/images/<restaurantID>', methods=['GET'])
def images(restaurantID):
    restaurant_photos = list(filter(lambda r: r['business_id'] == restaurantID, photos))
    photo_ids = []   
    for p in restaurant_photos:
        photo_ids.append(p['photo_id'])
    return flask.jsonify(photo_ids)

@app.route('/image/<pictureID>', methods=['GET'])
def image(pictureID):
    with open(r"C:\Users\Adis\Desktop\photos/"+pictureID+".jpg", "rb") as imageFile:
        stri = base64.b64encode(imageFile.read())
    return stri

@app.route('/restaurant/<restaurantID>', methods=['GET'])
def restaurant(restaurantID):
    df_business = pd.read_csv (r'C:\Users\Adis\Desktop\dataset/restaurants.csv')
    
    for i in range(0,len(df_business)):
        if(df_business['business_id'][i] == restaurantID):
            id = str(df_business['business_id'][i])
            name = str(df_business['name'][i])
            city = str(df_business['city'][i])
            address = str(df_business['address'][i])
            longitude = str(df_business['longitude'][i])
            latitude = str(df_business['latitude'][i])
            stars = str(df_business['stars'][i])
            review_count = str(df_business['review_count'][i])
            attributes = str(df_business['attributes'][i])
            categories = str(df_business['categories'][i])
            break
    restaurant = {
        'business_id':id,
        'name':name,
        'city':city,
        'address':address,
        'lng':longitude,
        'lat':latitude,
        'stars':stars,
        'review_count':review_count,
        'attributes':attributes,
        'categories':categories
    }
    return flask.jsonify(restaurant)

@app.route('/restaurantAll', methods=['GET'])
def restaurantAll():
    restaurants = []
    for b_id in boston_business:
        id = str(df_business['business_id'][df_business[df_business['business_id']==b_id].index.values[0]])
        name = str(df_business['name'][df_business[df_business['business_id']==b_id].index.values[0]])
        longitude = str(df_business['longitude'][df_business[df_business['business_id']==b_id].index.values[0]])
        latitude = str(df_business['latitude'][df_business[df_business['business_id']==b_id].index.values[0]])
        stars = str(df_business['stars'][df_business[df_business['business_id']==b_id].index.values[0]])
        review_count = str(df_business['review_count'][df_business[df_business['business_id']==b_id].index.values[0]])
        attributes = str(df_business['attributes'][df_business[df_business['business_id']==b_id].index.values[0]])
        categories = str(df_business['categories'][df_business[df_business['business_id']==b_id].index.values[0]])
        restaurant = {'business_id':id,'name':name,'lng':longitude,'lat':latitude,'stars':stars,'review_count':review_count,
        'attributes':attributes,'categories':categories}
        restaurants.append(restaurant)
    return flask.jsonify(restaurants)

@app.route('/predictSpecific/<userID>/<restaurantID>', methods=['GET'])
def predictSpecific(userID,restaurantID):
    filename = 'finalized_model.sav'
    loaded_model = pickle.load(open(filename, 'rb'))
    algo = loaded_model

    prediction= algo.predict(uid= userID, iid=restaurantID)

    return flask.jsonify(prediction.est)

@app.route('/predict/<userId>/<topN>/<minRating>/<lat>/<lng>/<radius>/<useRadius>/<usePred>/<useAvg>/<useMin>', methods=['GET'])
def predict(userId,topN,minRating,lat,lng,radius,useRadius,usePred,useAvg,useMin):
    filename = 'finalized_model.sav'
    loaded_model = pickle.load(open(filename, 'rb'))
    algo = loaded_model

    #make predictions
    distance = 0
    predictions = []
    for b_id in boston_business:
        avg = int(df_business['stars'][df_business[df_business['business_id']==b_id].index.values[0]])
        prediction = algo.predict(uid= userId, iid=b_id)
        if(int(useAvg) == 0):
            predictions.append([b_id,prediction.est,distance])
        elif(int(usePred) == 0):
            predictions.append([b_id,avg,distance])
        else:
            predictions.append([b_id,(prediction.est + avg)/2,distance])

    sorted_pred = sorted(predictions, key=itemgetter(1), reverse=True)
    
    #filter on minimum rating
    if(int(useMin) == 0):
        minRating = 0
    predMinRating = []
    for p in sorted_pred:
        if(p[1] >= float(minRating)):
            predMinRating.append(p)
        else:
            break
    sorted_pred = predMinRating
    
    predRestaurants = []
    print(len(sorted_pred))
    #calculate distance and make a list of restaurants
    for i in range(0,len(sorted_pred)):
        name = df_business['name'][df_business[df_business['business_id']==sorted_pred[i][0]].index.values[0]]
        predRating = sorted_pred[i][1]
        longitude = df_business['longitude'][df_business[df_business['business_id']==sorted_pred[i][0]].index.values[0]]
        latitude = df_business['latitude'][df_business[df_business['business_id']==sorted_pred[i][0]].index.values[0]]
        distance = calculateDistance(float(lat),float(lng),float(latitude),float(longitude))
        restaurant = {'business_id':sorted_pred[i][0],'name':name,'predRating':predRating,'lng':longitude,'lat':latitude, 'distance':distance}
        predRestaurants.append(restaurant)

    #filter based on radius   
    predRestaurants = sorted(predRestaurants, key=sortFunction)
    if(int(useRadius)==1):
        inRadius = []
        for r in predRestaurants:
            if(r['distance'] < float(radius)):
                inRadius.append(r)
        predRestaurants = inRadius
    if(len(predRestaurants)==0):
        print("nula")
    #print("dist",predRestaurants[0]['distance'])
    print("len",len(predRestaurants))
    #filter based on topN
    index = int(topN)
    if(index > len(predRestaurants)):
        index = len(predRestaurants)
    predRestaurants = predRestaurants[:index]
    print("len",len(predRestaurants))

    return flask.jsonify(predRestaurants)

@app.route('/predictBest/<userId>/<topN>/<minRating>', methods=['GET'])
def predictBest(userId,topN,minRating):
    filename = 'finalized_model.sav'
    loaded_model = pickle.load(open(filename, 'rb'))
    algo = loaded_model

    distance = 0
    predictions = []
    for b_id in boston_business:
        prediction= algo.predict(uid= userId, iid=b_id)
        predictions.append([b_id,prediction.est,distance])

    sorted_pred = sorted(predictions, key=itemgetter(1), reverse=True)
    
    predMinRating = []
    for p in sorted_pred:
        if(p[1] >= float(minRating)):
            predMinRating.append(p)
        else:
            break

    sorted_pred = predMinRating
    predRestaurants = []
    
    print(len(sorted_pred))
    for i in range(0,len(sorted_pred)):
        name = df_business['name'][df_business[df_business['business_id']==sorted_pred[i][0]].index.values[0]]
        predRating = sorted_pred[i][1]
        longitude = df_business['longitude'][df_business[df_business['business_id']==sorted_pred[i][0]].index.values[0]]
        latitude = df_business['latitude'][df_business[df_business['business_id']==sorted_pred[i][0]].index.values[0]]
        restaurant = {'business_id':sorted_pred[i][0],'name':name,'predRating':predRating,'lng':longitude,'lat':latitude}
        predRestaurants.append(restaurant)
        

    index = int(topN)
    if(index > len(predRestaurants)):
        index = len(predRestaurants)
    
    predRestaurants = predRestaurants[:index]

    return flask.jsonify(predRestaurants)

@app.route('/photos/<business_id>', methods=['GET'])
def photoF(business_id):
    df_photos = pd.read_csv (r'C:\Users\Adis\Downloads\photos\yelp_photos\photos.csv')
    return


app.run()