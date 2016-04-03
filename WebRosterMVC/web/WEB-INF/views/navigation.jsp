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
    </head>

    <body>
        <fieldset class="navField">
            <legend> Navigation </legend>
            <form method="GET" action="browse">
                <input type="submit" value="Browse"/>
            </form>
            <form method="GET" action="update">
                <input type="submit" value="Update"/>
            </form>
            <form method="GET" action="addTeam">
                <input type="submit" value="Add Team"/>
            </form>
            <form method="GET" action="addStudent">
                <input type="submit" value="Add Student"/>
            </form>
            <form method="GET" action="deleteTeam">
                <input type="submit" value="Delete Team"/>
            </form>
        </fieldset>
    </body>
</html>
