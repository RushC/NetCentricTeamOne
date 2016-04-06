<%-- 
    Document   : navigation
    Created on : Apr 1, 2016, 5:44:25 PM
    Author     : mwd5503
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="css/navigation.css">
        <script src="js/nav.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
    </head>

    <body>
        <fieldset class="navField">
            <legend> Navigation </legend>
            <a href="?dest=browse">Browse</a>
            <a href="?dest=update">Update</a>
            <a href="?dest=addStudent">Add Student</a>
            <a href="?dest=removeTeam">Remove Team</a>
            <a href="?dest=removeStudent">Remove Student</a>
        </fieldset>
    </body>
</html>
