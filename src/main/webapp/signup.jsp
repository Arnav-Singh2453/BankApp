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
    <form action="./signup" method="post">
        <div>Name</div>
        <input type="text" name="uname" placeholder="Enter Full Name">
        <div>Phone No.</div>
        <input type="number" name="phone" placeholder="Enter Phone No">
        <div>Age</div>
        <input type="number" name="age" placeholder="Enter Age">
        <div>Password</div>
        <input type="password" name="pass" id="">
        <input type="submit" value="Sign up">
    </form>

    <div>
        <a href="./index.jsp"><input type="submit" value="Sign in"></a>
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