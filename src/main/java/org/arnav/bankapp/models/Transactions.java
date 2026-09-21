package org.arnav.bankapp.models;

import jakarta.persistence.Embeddable;
import jakarta.persistence.*;

@Entity
public class Transactions {
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Boolean getSent() {
        return sent;
    }

    public void setSent(Boolean sent) {
        this.sent = sent;
    }

    @Id
    int id;

    public String status(Boolean sent) {
        if (sent) {
            return "sent";
        } else {
            return "received";
        }
    }

    @Override
    public String toString() {
        return "id=" + id +
                ", amount=" + amount +
                ", " + status(this.sent);
    }


    double amount;
    Boolean sent;

    public Transactions() {
    }

    ;

    public Transactions(int id, double amount, Boolean sent) {
        this.id = id;
        this.amount = amount;
        this.sent = sent;
    }
}
