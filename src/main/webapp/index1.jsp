<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body>
<%if((boolean)session.getAttribute("login")){ %>
<h1>${uname}</h1>
<br/>
<button type="button" id="submitBtn" onclick="logout()">logout</button>

<a href="/Login">Hello Servlet</a>

<a href="pay.jsp">Pay</a>
<a href="transh.jsp">History</a>
<script>
    function logout() {
        axios.post('${pageContext.request.contextPath}/logout')
            .then(function (response){
            window.location.href = '${pageContext.request.contextPath}/index.jsp';
        })
            .catch(err => {
                console.error('Logout failed:', err);
            });
    }
    <%}else{%>
    <a href="index.jsp">Login first</a>
    <%}%>

</script>
</body>
</html>