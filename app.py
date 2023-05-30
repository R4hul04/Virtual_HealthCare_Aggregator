from flask import Flask,render_template, url_for ,flash , redirect
import joblib
from flask import request
import numpy as np
import tensorflow
import sqlite3  
import subprocess as sp
#from subprocess import call

import os
from flask import send_from_directory
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import tensorflow as tf

#from this import SQLAlchemy
app=Flask(__name__,template_folder='template')

#from model import User,Post

#//////////////////////////////////////////////////////////

dir_path = os.path.dirname(os.path.realpath(__file__))
# UPLOAD_FOLDER = dir_path + '/uploads'
# STATIC_FOLDER = dir_path + '/static'
UPLOAD_FOLDER = 'uploads'
STATIC_FOLDER = 'static'


@app.route("/")

@app.route("/home")
def home():
    return render_template("welcome 1.html")

@app.route("/Appointment")
def Appointment():
    return render_template("calender.html")

@app.route("/P_login")
def login():
    return render_template("signin.html")

@app.route("/search")
def search():
    return render_template("search.html")


@app.route("/saveDetails", methods =['POST','GET'])
def saveDetails():  
    msg = "msg"  
    #con = sqlite3.connect("patientdetails.db")   
    if request.method == "POST":
        print("Database opened successfully") 
        try:  
            f_name = request.form["f_name"] 
            l_name = request.form["l_name"] 
            contact = request.form["contact"]
            email_id = request.form["email_id"]
            password = request.form["password"]  
            address = request.form["address"]
            pin_code = request.form["pin_code"]
            city = request.form["city"]  
            with sqlite3.connect("patientdetails.db") as con:  
                cur = con.cursor()  
                cur.execute("INSERT into p_reg (f_name,l_name,contact,email_id,password,address,pin_code,city) values (?,?,?,?,?,?,?,?)",(f_name,l_name,contact,email_id,password,address,pin_code,city))  
                con.commit()               
        except:  
            con.rollback()  
            msg = "We can not add the employee to the list"
            print('abc')
        finally:  
            return render_template("signin.html",msg = msg)  
            con.close()


@app.route("/logincheck", methods =['POST','GET'])
def logincheck():  
    msg = "msg"
    print('in')  
    if request.method == "POST":
        try:  
            email_id = request.form["email_id"]
            password = request.form["password"]  
              
            with sqlite3.connect("patientdetails.db") as con:  
                cur = con.cursor()  
                cur.execute("SELECT DISTINCT password FROM p_reg WHERE email_id=?;",[email_id])
                rows = cur.fetchall()
                print(rows)   
                con.commit()
                #return redirect(url_for('Appointment'))
        except:  
            con.rollback()  
            msg = "We can not add the employee to the list"
            print('abc')
        finally:  
            return redirect(url_for('search'))
            con.close()  
            

@app.route("/P_signup")
def signup():
    return render_template("signup.html")  
    
@app.route("/about") 
def about():
    #return render_template("about.html")
    #call(["php", "C:/Users/Devesh/Desktop/Project using flask/template/demo.php"])
    out = sp.run(["php", "demo.php"], stdout=sp.PIPE)
    return out.stdout

@app.route("/cancer")
def cancer():
    return render_template("cancer.html")



@app.route("/diabetes")
def diabetes():
    #if form.validate_on_submit():
    return render_template("diabetes.html")

@app.route("/heart")
def heart():
    return render_template("heart.html")

def ValuePredictor(to_predict_list, size):
    to_predict = np.array(to_predict_list).reshape(1,size)
    '''if(size==8):#Diabetes
        loaded_model = joblib.load("model1")
        result = loaded_model.predict(to_predict)'''
    if(size==8):#Diabetes
        loaded_model = joblib.load("diabetes_model")
        result = loaded_model.predict(to_predict)
    elif(size==30):#Cancer
        loaded_model = joblib.load("model")
        result = loaded_model.predict(to_predict)
    elif(size==12):#Kidney
        loaded_model = joblib.load("model3")
        result = loaded_model.predict(to_predict)
    elif(size==10):
        loaded_model = joblib.load("model4")
        result = loaded_model.predict(to_predict)
    elif(size==11):#Heart
        loaded_model = joblib.load("model2")
        result =loaded_model.predict(to_predict)
    return result[0]

@app.route('/result',methods = ["POST"])
def result():
    if request.method == 'POST':
        to_predict_list = request.form.to_dict()
        to_predict_list=list(to_predict_list.values())
        to_predict_list = list(map(float, to_predict_list))
        if(len(to_predict_list)==30):#Cancer
            result = ValuePredictor(to_predict_list,30)
        elif(len(to_predict_list)==8):#Daiabtes
            result = ValuePredictor(to_predict_list,8)
        elif(len(to_predict_list)==12):
            result = ValuePredictor(to_predict_list,12)
        elif(len(to_predict_list)==11):
            result = ValuePredictor(to_predict_list,11)
            #if int(result)==1:
            #   prediction ='diabetes'
            #else:
            #   prediction='Healthy' 
        elif(len(to_predict_list)==10):
            result = ValuePredictor(to_predict_list,10)
    if(int(result)==1):
        prediction='Sorry ! Suffering'
    else:
        prediction='Congrats ! you are Healthy' 
    return(render_template("result.html", prediction=prediction))


if __name__ == "__main__":
    app.run(debug=True)