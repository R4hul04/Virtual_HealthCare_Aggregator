import sqlite3


con = sqlite3.connect("patientdetails.db")
email_id= "devesh.more@sakec.ac.in"
cur = con.cursor()  
cur.execute("SELECT DISTINCT password FROM p_reg WHERE email_id=?;",[email_id])
rows = cur.fetchall()
print(rows)   
con.commit()