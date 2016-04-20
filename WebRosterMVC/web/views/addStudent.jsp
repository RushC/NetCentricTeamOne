<%-- 
    Document   : addStudent
    Created on : Apr 1, 2016, 6:10:28 PM
    Author     : mwd5503
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>
        <jsp:include page="navigation.jsp"/>
        <h1>Todo: make it not kittens</h1>
        <form class="addStudentField" method="POST">
            <fieldset>
                <legend>Update a Student's Information</legend>
                <label>ID: </label>
                <input type='text' name="id" value="id"/>
                <label>First Name: </label>
                <input type="text" name="firstName" value="" />
                <label>Last Name: </label>
                <input type="text" name="lastName" value=""/>
                <label>Team Number: </label>
                <input type="text" name="team" value=""/>
                <input type="submit" value="DO IT!!">
            </fieldset>
        </form>
    </body>
</html>
