<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
</head>
<body>
<div>Do you want to pay to ${name}</div>
<form action="/psend" method="post">
    <input type="submit" value="Yes">
</form>
<br>
<a href="/pay.jsp">No</a>
</body>
</html>