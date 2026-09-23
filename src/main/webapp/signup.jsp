<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>p-easy - Create Account</title>
    <style>
        * {
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }

        body {
            background-color: #f0f4f8;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .cont {
            width: 100%;
            max-width: 480px;
            background-color: #ffffff;
            border: 2px solid #1a365d;
            border-radius: 12px;
            padding: 32px 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* --- Brand Logo & Header Styling --- */
        .brand-container {
            text-align: center;
            margin-bottom: 24px;
        }

        .brand-logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 6px;
        }

        .logo-badge {
            background-color: #2b6cb0;
            color: #ffffff;
            font-size: 28px;
            font-weight: 900;
            width: 52px;
            height: 52px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(43, 108, 176, 0.3);
        }

        .brand-name {
            font-size: 34px;
            font-weight: 800;
            color: #1a365d;
            letter-spacing: -0.5px;
        }

        .brand-tagline {
            font-size: 15px;
            color: #4a5568;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 4px;
        }

        h2 {
            color: #1a365d;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 24px;
            text-align: center;
        }

        /* --- Form Elements --- */
        .form-group {
            margin-bottom: 18px;
        }

        label {
            display: block;
            font-size: 18px;
            font-weight: bold;
            color: #1a202c;
            margin-bottom: 8px;
        }

        input[type="text"],
        input[type="number"],
        input[type="password"] {
            width: 100%;
            padding: 16px;
            font-size: 18px;
            border: 2px solid #4a5568;
            border-radius: 8px;
            background-color: #ffffff;
            color: #000000;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        input[type="password"]:focus {
            outline: none;
            border-color: #2b6cb0;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
        }

        /* --- Buttons --- */
        .btn {
            display: block;
            width: 100%;
            padding: 16px;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            text-decoration: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 16px;
        }

        .btn-primary {
            background-color: #2b6cb0;
            color: #ffffff;
            border: none;
        }

        .btn-primary:hover {
            background-color: #2c5282;
        }

        .btn-secondary {
            background-color: #edf2f7;
            color: #2d3748;
            border: 2px solid #718096;
        }

        .btn-secondary:hover {
            background-color: #e2e8f0;
        }

        /* --- Error Box --- */
        .error-msg {
            margin-top: 20px;
            padding: 12px;
            background-color: #fff5f5;
            border: 2px solid #e53e3e;
            border-radius: 8px;
            color: #c53030;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }
    </style>
    <script src ="./sc.js"></script>
</head>
<body>

<div class="cont">
    <!-- Brand Header -->
    <div class="brand-container">
        <div class="brand-logo">
            <div class="logo-badge">P</div>
            <div class="brand-name">P-easy</div>
        </div>
        <div class="brand-tagline">Payment Made Easy</div>
    </div>

    <h2>Create New Account</h2>

    <form action="./signup" method="post">
        <div class="form-group">
            <label for="uname">Full Name</label>
            <input type="text" id="uname" name="uname" placeholder="Enter Full Name" required>
        </div>

        <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="number" id="phone" name="phone" placeholder="Enter Phone No" required>
        </div>

        <div class="form-group">
            <label for="age">Age</label>
            <input type="number" id="age" name="age" placeholder="Enter Age" required>
        </div>

        <div class="form-group">
            <label for="pass">Password</label>
            <input type="password" id="pass" name="pass" placeholder="Enter Password" required>
        </div>

        <input type="submit" value="Sign Up" class="btn btn-primary">
    </form>

    <div>
        <a href="./index.jsp" style="text-decoration: none;">
            <button type="button" class="btn btn-secondary">Already have an account? Sign In</button>
        </a>
    </div>

    <%
        String error = (String) request.getAttribute("msg");
        if (error != null) {
    %>
    <div class="error-msg"><%= error %></div>
    <%  } %>
</div>

</body>
</html>