package org.arnav.bankapp.functions;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.arnav.bankapp.utils.DBUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;


@Controller
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class loginServlet {
    @RequestMapping("/")
    public String code(HttpServletResponse res) throws IOException {
        return "index.jsp" ;
    }
    @PostMapping("/hello-servlet")
    public void login(HttpServletRequest request, HttpServletResponse response) throws IOException {

        int uname;
        try {
            uname = Integer.parseInt(request.getParameter("uname"));
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().print("{\"success\":false,\"message\":\"User ID must be numeric\"}");
            return;
        }
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
            session.setAttribute("uid",uname);
            session.setAttribute("pid",0);
            session.setAttribute("amount",0);
            session.setAttribute("login",true);
                    out.print("{\"success\":true,\"message\":\"Login successful\"}");
                    return;

                } else {

                    out.print("{\"success\":false,\"message\":\"Wrong password\"}");

                }

            } else {

                out.print("{\"success\":false,\"message\":\"Wrong username\"}");

            }

            out.flush();

        } catch (SQLException e) {

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");

            response.getWriter().print(
                    "{\"success\":false,\"message\":\"Database error\"}"
            );

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
        public void signup(HttpServletRequest request, HttpServletResponse response) throws IOException{
            String uname = request.getParameter("uname");
            String phone = (request.getParameter("phone"));
            String passw = request.getParameter("pass");
            Connection connect=null;
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();
            try {

                int age = Integer.parseInt(request.getParameter("age"));
                if (uname == null || uname.trim().isEmpty() || phone == null || phone.trim().isEmpty()
                        || passw == null || passw.isEmpty() || age < 1) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    out.print("{\"success\":false,\"message\":\"Please enter valid account details\"}");
                    return;
                }

                connect = DBUtil.getConnection();
                connect.setAutoCommit(false);

                String sql = "select * from User_Info where Phone=?";

                PreparedStatement smt = connect.prepareStatement(sql);

                smt.setString(1,phone);
                ResultSet rs = smt.executeQuery();
                if(rs.next()){
                    response.setStatus(HttpServletResponse.SC_CONFLICT);
                    out.print("{\"success\":false,\"message\":\"Phone number is already registered\"}");
                    return;

                }
                else{
                    sql = "insert into User_Info(`Password`,`Age`,`Phone`,`Name`,`Balance`) values(?,?,?,?,?)";
                    smt = connect.prepareStatement(sql);
                    smt.setString(1,passw);
                    smt.setInt(2,age);
                    smt.setString(3,phone);
                    smt.setString(4,uname);
                    smt.setDouble(5,5000.0);
                    int x = smt.executeUpdate();
                    if(x>0){
                        sql = "Select `userID` from User_Info where `Phone`=?";
                        smt=connect.prepareStatement(sql);
                        smt.setString(1,phone);
                        rs = smt.executeQuery();
                        if(!rs.next()) {
                            connect.rollback();
                            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                            out.print("{\"success\":false,\"message\":\"Could not create account\"}");
                            return;
                        }
                        int userId = rs.getInt(1);
                        sql = "Insert into Trans_History(`userID`,`transactions`)values(?,?)";
                        smt = connect.prepareStatement(sql);
                        smt.setInt(1,userId);
                        smt.setString(2,"[]");
                        int y = smt.executeUpdate();
                        if(y == 0){
                            connect.rollback();
                        }
                        else{
                         connect.commit();
                        HttpSession session = request.getSession();
                        session.setAttribute("uid", userId);
                        session.setAttribute("pid", 0);
                        session.setAttribute("amount", 0D);
                        session.setAttribute("login", true);
                        out.print("{\"success\":true,\"message\":\"User registered successfully\",\"userID\":" + userId + "}");
                        }
                    }else{

                        connect.rollback();
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        out.print("{\"success\":false,\"message\":\"Could not create account\"}");
                    }
                }

            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"success\":false,\"message\":\"Please enter valid account details\"}");
            } catch (SQLException e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"success\":false,\"message\":\"" + jsonEscape(e.getMessage()) + "\"}");
            }
            finally {
                out.close();
                try {
                    if (connect != null) connect.close();
                } catch (SQLException e) {
                    System.out.println(e.getMessage());
                }
            }
        }

    @GetMapping("/account")
    public void account(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("uid") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"success\":false,\"message\":\"Please log in first\"}");
            return;
        }

        try (Connection connect = DBUtil.getConnection();
             PreparedStatement statement = connect.prepareStatement("select userID, Name, Age, Phone, Balance from User_Info where userID = ?")) {
            statement.setInt(1, (Integer) session.getAttribute("uid"));
            ResultSet result = statement.executeQuery();
            if (!result.next()) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().print("{\"success\":false,\"message\":\"Account not found\"}");
                return;
            }
            response.getWriter().print("{\"success\":true,\"user\":{\"userID\":" + result.getInt("userID")
                    + ",\"name\":\"" + result.getString("Name") + "\",\"age\":" + result.getInt("Age")
                    + ",\"phone\":\"" + result.getString("Phone") + "\"},\"balance\":" + result.getDouble("Balance") + "}");
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print("{\"success\":false,\"message\":\"" + jsonEscape(e.getMessage()) + "\"}");
        }
    }

    private String jsonEscape(String value) {
        if (value == null) return "Database error";
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    @PostMapping("/logout")
        public void logout(HttpServletRequest request, HttpServletResponse response) throws IOException{
        System.out.println("logout");
            HttpSession session = request.getSession();
            session.setAttribute("login",false);

        }
}
