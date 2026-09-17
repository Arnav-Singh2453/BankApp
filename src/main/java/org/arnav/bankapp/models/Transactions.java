package org.arnav.bankapp.models;

import jakarta.persistence.Embeddable;
import jakarta.persistence.*;

@Entity
public class Transactions {
    @Id
    int id;
    int amount;
    Boolean sent;
}
