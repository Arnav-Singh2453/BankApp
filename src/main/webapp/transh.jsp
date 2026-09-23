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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>p-easy - Transaction History</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="./sc.js"></script>

    <style>
        * {
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }

        body {
            background-color: #f0f4f8;
            margin: 0;
            padding: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .card {
            width: 100%;
            max-width: 600px;
            background-color: #ffffff;
            border: 2px solid #1a365d;
            border-radius: 12px;
            padding: 32px 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* --- Header & Logo Styling --- */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid #e2e8f0;
        }

        .brand-logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo-badge {
            background-color: #2b6cb0;
            color: #ffffff;
            font-size: 22px;
            font-weight: 900;
            width: 42px;
            height: 42px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .brand-name {
            font-size: 26px;
            font-weight: 800;
            color: #1a365d;
        }

        .btn-logout {
            background-color: #c53030;
            color: #ffffff;
            border: none;
            padding: 10px 18px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
        }

        .btn-logout:hover {
            background-color: #9b2c2c;
        }

        h2 {
            font-size: 24px;
            color: #1a365d;
            margin-top: 0;
            margin-bottom: 20px;
        }

        /* --- 3-Column Transaction History Table --- */
        .trans-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 24px;
            max-height: 380px;
            overflow-y: auto;
            padding-right: 4px;
        }

        .trans-header {
            display: grid;
            grid-template-columns: 2fr 1.5fr 1.2fr;
            padding: 10px 16px;
            font-size: 16px;
            font-weight: bold;
            color: #4a5568;
            border-bottom: 2px solid #cbd5e0;
        }

        .trans-row {
            display: grid;
            grid-template-columns: 2fr 1.5fr 1.2fr;
            align-items: center;
            background-color: #f7fafc;
            border: 2px solid #cbd5e0;
            border-radius: 10px;
            padding: 14px 16px;
            font-size: 18px;
            color: #1a202c;
        }

        .col-id {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: bold;
        }

        .col-amount {
            font-weight: bold;
            color: #1a202c;
        }

        .col-status {
            text-align: right;
            font-size: 16px;
            font-weight: bold;
        }

        /* Directional Arrows & Badges */
        .arrow-sent {
            color: #c53030; /* Red arrow for sent */
            font-size: 20px;
        }

        .arrow-received {
            color: #2f855a; /* Green arrow for received */
            font-size: 20px;
        }

        .badge-sent {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 14px;
            background-color: #fed7d7;
            color: #9b2c2c;
            font-weight: bold;
            text-transform: capitalize;
        }

        .badge-received {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 14px;
            background-color: #c6f6d5;
            color: #22543d;
            font-weight: bold;
            text-transform: capitalize;
        }

        .no-trans {
            text-align: center;
            padding: 24px;
            background-color: #ebf8ff;
            border: 2px dashed #3182ce;
            border-radius: 8px;
            color: #2b6cb0;
            font-size: 18px;
            font-weight: bold;
        }

        /* --- Buttons --- */
        .btn-home {
            display: block;
            width: 100%;
            padding: 16px;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            background-color: #2b6cb0;
            color: #ffffff;
            border-radius: 8px;
            text-decoration: none;
        }

        .btn-home:hover {
            background-color: #2c5282;
        }

        /* --- Access Denied State --- */
        .notice-card {
            text-align: center;
            padding: 12px;
        }

        .notice-title {
            font-size: 22px;
            color: #c53030;
            margin-bottom: 16px;
        }

        .btn-link {
            display: inline-block;
            background-color: #2b6cb0;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            font-size: 18px;
            font-weight: bold;
            border-radius: 8px;
        }
    </style>
</head>
<body>

<div class="card">
    <% if (session.getAttribute("login") != null && (Boolean) session.getAttribute("login")) { %>

    <!-- Header with Brand Logo & Logout -->
    <div class="header">
        <div class="brand-logo">
            <div class="logo-badge">P</div>
            <div class="brand-name">P-easy</div>
        </div>
        <button type="button" id="submitBtn" class="btn-logout" onclick="logout()">Log Out</button>
    </div>

    <h2>Recent Transactions</h2>

    <div class="trans-list">
        <!-- 3 Column Headers -->
        <div class="trans-header">
            <div>Trans ID</div>
            <div>Amount</div>
            <div style="text-align: right;">Type</div>
        </div>

        <%
            final ObjectMapper objectMapper = new ObjectMapper();
            Connection con = DBUtil.getConnection();
            String sql = "Select * from trans_history where userID=?";
            PreparedStatement smt = con.prepareStatement(sql);

            Object uidObj = session.getAttribute("uid");
            if (uidObj != null) {
                smt.setInt(1, (Integer) uidObj);
            }

            boolean hasTransactions = false;
            try {
                ResultSet rs = smt.executeQuery();
                if (rs.next()) {
                    String s = rs.getString("transactions");
                    if (s != null && !s.trim().isEmpty()) {
                        List<Transactions> list = objectMapper.readValue(s, new TypeReference<List<Transactions>>() {});
                        if (list != null && !list.isEmpty()) {
                            hasTransactions = true;
                            for (Transactions t : list) {
                                boolean isSent = Boolean.TRUE.equals(t.getSent());
        %>
        <div class="trans-row">
            <!-- Column 1: ID with Directional Arrow -->
            <div class="col-id">
                                            <span class="<%= isSent ? "arrow-sent" : "arrow-received" %>">
                                                <%= isSent ? "➔" : "⬅" %>
                                            </span>
                <span>#<%= t.getId() %></span>
            </div>

            <!-- Column 2: Amount -->
            <div class="col-amount">
                ₹<%= String.format("%.2f", t.getAmount()) %>
            </div>

            <!-- Column 3: Status / Type -->
            <div class="col-status">
                                            <span class="<%= isSent ? "badge-sent" : "badge-received" %>">
                                                <%= t.status(isSent) %>
                                            </span>
            </div>
        </div>
        <%
                            }
                        }
                    }
                }
            } catch (SQLException e) {
                throw new RuntimeException(e);
            } finally {
                if (smt != null) try { smt.close(); } catch (SQLException ignored) {}
                if (con != null) try { con.close(); } catch (SQLException ignored) {}
            }

            if (!hasTransactions) {
        %>
        <div class="no-trans">No transaction history found.</div>
        <%  } %>
    </div>

    <!-- Navigation Button -->
    <a href="index1.jsp" class="btn-home">Go Back to Home</a>

    <% } else { %>

    <!-- Logged-Out View -->
    <div class="notice-card">
        <h2 class="notice-title">Please Sign In First</h2>
        <p style="font-size: 16px; color: #4a5568; margin-bottom: 24px;">You need to log in to view your transaction history.</p>
        <a href="index.jsp" class="btn-link">Go to Sign In</a>
    </div>

    <% } %>
</div>

<script>
    function logout() {
        axios.post('${pageContext.request.contextPath}/logout')
            .then(function (response) {
                sessionStorage.clear();
                localStorage.clear();
                window.location.replace('${pageContext.request.contextPath}/index.jsp');
            })
            .catch(function (err) {
                console.error('Logout failed:', err);
            });
    }
</script>

</body>
</html>