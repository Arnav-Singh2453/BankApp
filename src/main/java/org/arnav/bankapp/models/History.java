package org.arnav.bankapp.models;

import jakarta.persistence.*;

import java.util.*;

@Entity
@Table(name = "Trans_History")
public class History {
    @Id
    @Column(name="userID")
    private int userID;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List <Transactions> transactions =  new ArrayList<>();

}