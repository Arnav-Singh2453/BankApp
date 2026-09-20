package org.arnav.bankapp.functions;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.arnav.bankapp.utils.DBUtil;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Controller
public class pay {
    @PostMapping("/send")
    public String send( HttpServletRequest req,HttpServletResponse response){
      Connection connect = null  ;
      PreparedStatement smt = null;
      try{
          connect = DBUtil.getConnection();
          HttpSession session = req.getSession(false);
          session.getAttribute("uid");
          int payid=Integer.parseInt(req.getParameter("payid"));
          double amount=Double.parseDouble(req.getParameter("amount"));
          String sql = "Select * from User_Info where userID = ?";

           smt = connect.prepareStatement(sql);
           smt.setInt(1, payid);
           ResultSet rs = smt.executeQuery();
           if(rs.next()) {
               session.setAttribute("amount",amount);
               session.setAttribute("pid",payid);
               session.setAttribute("name" , rs.getString(5) );

              return "paymentsucc.jsp";
           }
           else{
               return "pay.jsp";
           }
      } catch (Exception e) {
          throw new RuntimeException(e);
      }
    }
    @PostMapping("/psend")
    public void psend(HttpServletRequest req,HttpServletResponse response){
        HttpSession session = req.getSession(false);
        Connection connect = null  ;
        PreparedStatement smt = null;
        try{
         connect = DBUtil.getConnection();
         String sql = "Select * from User_Info where userID = ?";
         smt = connect.prepareStatement(sql);
         smt.setInt(1, (Integer) session.getAttribute("uid"));
         ResultSet rs = smt.executeQuery();
         if(rs.next()) {
             double amt = (double)session.getAttribute("amount");
             if(rs.getDouble("balance")>amt){
                 sql = "Update User_Info set balance = balance - ?  where userID = ?";
                 smt = connect.prepareStatement(sql);
                 smt.setDouble(1, amt);
                 smt.setInt(2, (int)session.getAttribute("uid"));
                 int x=smt.executeUpdate();
                 if(x>0){
                     sql = "Update User_Info set balance = balance + ?  where userID = ?";
                     smt = connect.prepareStatement(sql);
                     smt.setDouble(1, amt);
                     smt.setInt(2, (int)session.getAttribute("pid"));
                     int y=smt.executeUpdate();
                     if(y>0){
                         System.out.println("Payed successfully");
                     }
                 }
                 else{
                     System.out.println("Payment failed due some error");
                 }

             }
             else{

             System.out.println("payment failed due to insufficient balance");
             }
         }else{
             System.out.println("User not found");
         }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }
}
