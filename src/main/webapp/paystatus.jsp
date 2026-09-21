<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
</head>
<body>
<%if((boolean)session.getAttribute("login")){ %>
<h1>${msg}</h1>
<br/>
<div>from : ${uid}</div>
<div>to : ${pid}</div>
<div>amount: ${amount}</div>
<a href="index1.jsp">go back to home</a>
<%}else{%>
<a href="index.jsp">Login first</a>
<%}%>
</body>
</html>