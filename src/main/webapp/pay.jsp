<%@ page import="jakarta.servlet.http.HttpSession" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
</head>
<body>
<%if((boolean)session.getAttribute("login")){ %>
<form action="/send" method="post">
    <input type="number" name="amount" placeholder="Enter amount" value="${amount}" >
    <input type="number" name="payid" placeholder="Enter customerId" value="${pid}" >
    <input type="submit" value="Pay">
</form>
<%}else{%>
<a href="index.jsp">Login first</a>
<%}%>
</body>
</html>