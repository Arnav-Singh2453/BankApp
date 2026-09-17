<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<style>
    .cont{
        width: 50vw;
        margin: auto;
        background-color: antiquewhite;
        height: 50vh;
        margin-top: 25vh;
    }
    form{
        margin-bottom: 10px;
    }
</style>
<body>
<div class="cont">
    <form action="./hello-servlet" method="post">
        <div>Username</div>
        <input type="number" name="uname" placeholder="Enter Username">
        <div>Password</div>
        <input type="password" name="pass" id="">
        <input type="submit" value="Sign in">
    </form>

    <div>

        <a href="./signup.jsp"><input type="submit" value="Sign up"></a>

    </div>
    <%
        String error = (String) request.getAttribute("msg");
        if(error!=null){
    %>
    <div><%=error%></div>
    <%    }
    %>
</div>
</body>
</html>