package org.arnav.bankapp.models;

import jakarta.persistence.*;
import org.hibernate.annotations.*;
import org.springframework.boot.context.properties.bind.Name;
import org.springframework.stereotype.Component;

@Entity
@Table(name="User_Info")
public class User {
    public User(){};
    @Id
    @Column(name="userID")
    @GeneratedValue(generator = "myseq",strategy=GenerationType.SEQUENCE)
    @SequenceGenerator(name = "myseq",sequenceName = "seq",initialValue =  100000000,allocationSize = 1)
    private int userID;
    private String Password;
    private int Age;
    @Column(unique = true)
    private String Phone;
    private String Name;
    private double Balance;

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        this.Password = password;
    }

    public int getAge() {
        return Age;
    }

    public void setAge(int age) {
        this.Age = age;
    }

    public String getPhone() {
        return Phone;
    }

    public void setPhone(String phone) {
        Phone = phone;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public Double getBalance() {
        return Balance;
    }

    public void setBalance(Double balance) {
        Balance = balance;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }


}
