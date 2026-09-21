<%@ page import="java.sql.Connection" %>
<%@ page import="org.arnav.bankapp.utils.DBUtil" %>
<%@ page import="java.sql.PreparedStatement" %>
<%@ page import="jakarta.servlet.http.HttpSession" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="java.sql.SQLException" %>
<%@ page import="org.arnav.bankapp.models.Transactions" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper" %>
<%@ page import="com.fasterxml.jackson.core.type.TypeReference" %>
<%@ page import="java.lang.reflect.Type" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
</head>
<body>
<%if((boolean)session.getAttribute("login")){ %>
<%
    final ObjectMapper objectMapper = new ObjectMapper();

    Connection con = DBUtil.getConnection();
    String sql = "Select * from trans_history where userID=?";

    PreparedStatement smt = con.prepareStatement(sql);
    smt.setInt(1,(int)session.getAttribute("uid"));
    try {
        ResultSet rs = smt.executeQuery();
        if(rs.next()){
            String s = rs.getString("transactions");
            List<Transactions> list=new ArrayList<>();
            list = objectMapper.readValue(s, new TypeReference<List<Transactions>>() {
            });
            for(Transactions t:list){
                    out.println(t);
            }
        }
    } catch (SQLException e) {
        throw new RuntimeException(e);
    }

%>
<a href="index1.jsp">go back to home</a>
<%}else{%>
<a href="index.jsp">Login first</a>
<%}%>
</body>
</html>