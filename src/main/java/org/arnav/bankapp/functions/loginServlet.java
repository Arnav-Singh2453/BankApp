package org.arnav.bankapp.functions;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.arnav.bankapp.utils.DBUtil;
import org.hibernate.Session;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;


@Controller
public class loginServlet {
    @RequestMapping("/")
    public String code(HttpServletResponse res) throws IOException {
        return "index.jsp";
    }

    @PostMapping("/hello-servlet")
    public void login(HttpServletRequest request, HttpServletResponse response) throws IOException {

        int uname = Integer.parseInt(request.getParameter("uname"));
        String passw = request.getParameter("pass");

        Connection connect = null;

        try {
            connect = DBUtil.getConnection();
            String sql = "select * from User_Info where userID = ?";
            PreparedStatement smt = connect.prepareStatement(sql);
            smt.setInt(1, uname);

            ResultSet rs = smt.executeQuery();
            HttpSession session = request.getSession();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            PrintWriter out = response.getWriter();

            if (rs.next()) {
                System.out.println(rs.getString(2));
                if (rs.getString("Password").equals(passw)) {
                    session.setAttribute("uid", uname);
                    session.setAttribute("pid", 0);
                    session.setAttribute("amount", 0);
                    session.setAttribute("login", true);
                    session.setAttribute("username", rs.getString("Name"));
                    session.setAttribute("useramount", rs.getDouble("balance"));
                    out.print("{\"success\":true,\"message\":\"Login successful\"}");
                    request.getRequestDispatcher("./index1.jsp").forward(request, response);
                    return;

                } else {
                    session.setAttribute("msg", "Wrong Password");
                    request.getRequestDispatcher("./index.jsp").forward(request, response);

                }

            } else {
                session.setAttribute("msg", "Wrong CustomerID");
                request.getRequestDispatcher("./index.jsp").forward(request, response);


            }

            out.flush();

        } catch (SQLException e) {

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");

            response.getWriter().print(
                    "{\"success\":false,\"message\":\"Database error\"}"
            );

        } catch (ServletException e) {
            throw new RuntimeException(e);
        } finally {

            if (connect != null) {
                try {
                    connect.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @PostMapping("/signup")
    public void signup(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String uname = request.getParameter("uname");
        int age = Integer.parseInt(request.getParameter("age"));
        String phone = (request.getParameter("phone"));
        String passw = request.getParameter("pass");
        Connection connect = null;
        PrintWriter out = response.getWriter();
        ;
        try {

            connect = DBUtil.getConnection();
            connect.setAutoCommit(false);

            String sql = "select * from User_Info where Phone=?";

            PreparedStatement smt = connect.prepareStatement(sql);

            smt.setString(1, phone);
            ResultSet rs = smt.executeQuery();
            if (rs.next()) {
                request.setAttribute("msg", "Phone number is already registered");
                request.getRequestDispatcher("./signup.jsp").forward(request, response);
                return;

            } else {
                sql = "insert into User_Info(`Password`,`Age`,`Phone`,`Name`,`Balance`) values(?,?,?,?,?)";
                smt = connect.prepareStatement(sql);
                smt.setString(1, passw);
                smt.setInt(2, age);
                smt.setString(3, phone);
                smt.setString(4, uname);
                smt.setDouble(5, 5000.0);
                int x = smt.executeUpdate();
                if (x > 0) {
                    sql = "Select `userID` from User_Info where `Phone`=?";
                    smt = connect.prepareStatement(sql);
                    smt.setString(1, phone);
                    rs = smt.executeQuery();
                    if (!rs.next()) return;
                    sql = "Insert into Trans_History(`userID`,`transactions`)values(?,?)";
                    smt = connect.prepareStatement(sql);
                    smt.setInt(1, rs.getInt(1));
                    smt.setString(2, "[]");
                    int y = smt.executeUpdate();
                    if (y < 0) {
                        connect.rollback();
                    } else {
                        connect.commit();
                        request.setAttribute("msg", "User registered successfully login now. Your CustomerID is "+rs.getInt("userID"));
                        request.getRequestDispatcher("./index.jsp").forward(request, response);
                    }
                } else {

                    request.setAttribute("msg", "some error try again");
                    request.getRequestDispatcher("./signup.jsp").forward(request, response);
                }
            }

        } catch (SQLException | ServletException e) {
            System.out.println(e.getMessage());
        } finally {
            out.close();
            try {
                connect.close();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        System.out.println("logout");
        HttpSession session = request.getSession();
        session.setAttribute("login", false);
        session.invalidate();

    }
}
