package org.arnav.bankapp.functions;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.arnav.bankapp.models.Transactions;
import org.arnav.bankapp.utils.DBUtil;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Controller
public class pay {
    private final ObjectMapper objectMapper;

    public pay(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostMapping("/send")
    public String send(HttpServletRequest req, HttpServletResponse response) {
        Connection connect = null;
        PreparedStatement smt = null;
        try {
            connect = DBUtil.getConnection();
            HttpSession session = req.getSession(false);
            session.getAttribute("uid");
            int payid = Integer.parseInt(req.getParameter("payid"));
            double amount = Double.parseDouble(req.getParameter("amount"));
            String sql = "Select * from User_Info where userID = ?";

            smt = connect.prepareStatement(sql);
            smt.setInt(1, payid);
            ResultSet rs = smt.executeQuery();
            if (rs.next()) {
                session.setAttribute("amount", amount);
                session.setAttribute("pid", payid);
                session.setAttribute("name", rs.getString(5));

                return "pay.jsp";
            } else {
                return "pay.jsp";
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/psend")
    public String psend(HttpServletRequest req, HttpServletResponse response) {
        HttpSession session = req.getSession(false);
        Connection connect = null;
        PreparedStatement smt = null;
        try {
            connect = DBUtil.getConnection();
            String sql = "Select * from User_Info where userID = ?";
            smt = connect.prepareStatement(sql);
            smt.setInt(1, (Integer) session.getAttribute("uid"));
            ResultSet rs = smt.executeQuery();
            String ms = "";
            if (rs.next()) {
                double amt = (double) session.getAttribute("amount");
                if (rs.getDouble("balance") > amt) {
                    sql = "Update User_Info set balance = balance - ?  where userID = ?";
                    smt = connect.prepareStatement(sql);
                    smt.setDouble(1, amt);
                    smt.setInt(2, (int) session.getAttribute("uid"));
                    int x = smt.executeUpdate();
                    if (x > 0) {
                        sql = "Update User_Info set balance = balance + ?  where userID = ?";
                        smt = connect.prepareStatement(sql);
                        smt.setDouble(1, amt);
                        smt.setInt(2, (int) session.getAttribute("pid"));
                        int y = smt.executeUpdate();
                        if (y > 0) {
                            ms = "Payed successfully";
                            sql = "Select * from trans_history where userID = ?";
                            smt = connect.prepareStatement(sql);
                            smt.setInt(1, (int) session.getAttribute("uid"));
                            rs = smt.executeQuery();
                            List<Transactions> list = new ArrayList<>();
                            if (rs.next()) {

                                String s = rs.getString("transactions");
                                if (s != null && !s.trim().isEmpty()) {
                                    list = objectMapper.readValue(s, new TypeReference<List<Transactions>>() {
                                    });
                                }


                            }
                            list.add(0,new Transactions((int) session.getAttribute("pid"), (double) session.getAttribute("amount"), true));
                            String s = objectMapper.writeValueAsString(list);
                            sql = "Update trans_history set transactions = ?  where userID = ?";
                            smt = connect.prepareStatement(sql);
                            smt.setString(1, s);
                            smt.setInt(2, (int) session.getAttribute("uid"));
                            int z = smt.executeUpdate();
                            if (z > 0) {
                                sql = "Select * from trans_history where userID = ?";
                                smt = connect.prepareStatement(sql);
                                smt.setInt(1, (int) session.getAttribute("pid"));
                                rs = smt.executeQuery();
                                list = new ArrayList<>();
                                if (rs.next()) {

                                    s = rs.getString("transactions");
                                    if (s != null && !s.trim().isEmpty()) {
                                        list = objectMapper.readValue(s, new TypeReference<List<Transactions>>() {
                                        });
                                    }
                                }
                                list.add(0,new Transactions((int) session.getAttribute("uid"), (double) session.getAttribute("amount"), false));
                                s = objectMapper.writeValueAsString(list);
                                sql = "Update trans_history set transactions = ?  where userID = ?";
                                smt = connect.prepareStatement(sql);
                                smt.setString(1, s);
                                smt.setInt(2, (int) session.getAttribute("pid"));
                                z = smt.executeUpdate();
                                if (z > 0) {
                                    session.setAttribute("useramount", (double) session.getAttribute("useramount")-amt);
                                    System.out.println("transactions histpry updated successfully");

                                }

                            }
                        } else {
                            ms = "Payment failed due some error";
                        }

                    } else {

                        ms = "payment failed due to insufficient balance";
                    }
                    session.setAttribute("msg", ms);
                    return "paystatus.jsp";
                } else {
                    System.out.println("User not found");
                    return "pay.jsp";
                }
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return "index1.jsp";
    }
}
