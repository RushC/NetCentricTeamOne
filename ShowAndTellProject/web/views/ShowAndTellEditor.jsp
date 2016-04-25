<%@page import="DAO.CrudDao"%>
<%@page import="Model.Lecture"%>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="css/ShowAndTell.css" />
        <!-- jQuery and jQueryUI used for animations. -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
        <script src="js/html2canvas.js"></script>
        <script src="js/ShowAndTell.js"></script>
        <script src="js/side.js"></script>
        <script>
            addEventListener("load", function () {
                //parent.document.getElementById("sframe").contentDocument.location = "side.jsp";
                // Add hover functionality to each button.
                var buttons = $("button");
                for (var i = 0; i < buttons.length; i++) {
                    // Add the hover class when the mouse enters the button.
                    $(buttons[i]).mouseenter(function () {
                        $(this).stop(true, true).switchClass("", "hover", 200);
                    });
                    // Remove the hover class when the mouse leaves the button.
                    $(buttons[i]).mouseleave(function () {
                        $(this).stop(true, true).switchClass("hover", "", 200);
                    });
                }
            });
        </script>
    </head>
    <body>
        <!-- MOVED SIDEBAR -->
        <fieldset class="sideDiv">
            <legend> Show & Tell </legend>
            <button id="createLecture" onclick="createLecture()">Create Lecture</button><br>
            <label>Lecture:</label><br>
            <select id="lecture">
                <%
                    Lecture[] lectures = new CrudDao().getLectures();
                    for (Lecture lecture : lectures) {
                %>
                <option value="<%=lecture.getLectureID()%>"><%=lecture.getCourseTitle() + ": " + lecture.getLectureTitle()%></option>
                <%
                    }
                %>
            </select>
            <!-- Edit button
            <button id="editLecture" onclick="editLecture()">Edit Lecture</button> -->          
            <%
                if (lectures.length > 0) {
            %>
            <!-- <button id="deleteLecture" onclick="deleteLecture()">Delete Lecture</button><br> -->

            <label>Course:</label><br>
            <textarea cols="10" id="courseTitle"><%=lectures[0].getCourseTitle()%></textarea>
            <label>Lecture:</label><br>
            <textarea cols="10" id="lectureTitle"><%=lectures[0].getLectureTitle()%></textarea>
            <label>Instructor:</label>
            <textarea cols="10" id="instructor"><%=lectures[0].getInstructor()%></textarea>
            <%
                }
            %>
        </fieldset><br>
        <!-- END OF SIDEBAR -->

        <div id="lectureProperties"></div>
        <div id="wtfCSS">
            <div id="previewDiv">
                <fieldset class="externalFieldset">
                    <legend>Slide Preview</legend>
                    <form id="slideNav">
                        <button onclick="prev()">Previous</button>
                        <button onclick="next()">Next</button>
                        <input type="number" name="slideNum">
                        <button onclick="goToSlide()">Jump to Slide</button>
                    </form>
                    <div id="slidePreviewDiv"></div>
                </fieldset>
            </div>
            <div id="entityProperties">
                <fieldset class="externalFieldset">
                    <legend>Entity Properties</legend>
                    <form>
                        <fieldset class="internalFieldset">
                            <legend class="internalLegend">Type</legend>
                            <select id="typeInput" onchange="changeType()">
                                <option value="default" selected disabled>Select A Type</option>
                                <option value="textbox">Text Box</option>
                                <option value="bulletlist">Bulletted List</option>
                                <option value="image">Image</option>
                            </select>
                        </fieldset>

                        <fieldset class="internalFieldset">
                            <legend class="internalLegend">Location</legend>
                            <label>X Position:</label>
                            <input type="number" id="xInput" onchange="moveEntity()">
                            <label>Y Position:</label>
                            <input type="number" id="yInput" onchange="moveEntity()">
                            <label>Z index:</label>
                            <input type="number" id="zInput" onchange="moveEntity()">
                        </fieldset>
                        <fieldset class="internalFieldset">
                            <legend  class="internalLegend">Size</legend>
                            <label>Width:</label>
                            <input type="number" id="wInput" onchange="resizeEntity()" min="1">
                            <label>Height:</label>
                            <input type="number" id="hInput" onchange="resizeEntity()" min="1">
                        </fieldset>

                        <fieldset class="internalFieldset">
                            <legend class="internalLegend">Content</legend>
                            <div id="entityContent"></div>
                        </fieldset>
                    </form>
                </fieldset>
            </div>
        </div>
        <div id="entitiesDiv"></div>
        <div id="slideDiv">
            <div id="slideOptionsDiv">
                <fieldset class="externalFieldset">
                    <legend id="slideOptionsLegend">Slide Options</legend>
                    <form>
                        <label>Slide Sequence</label>
                        <input type="number" id="sequenceInput" onchange="setSlideSeq()" min="0">
                        <label>Slide Audio URL</label>
                        <input type="url" id="audioURLInput" onchange="setSlideAudioURL()">
                        <br>
                        <button onclick="deleteSlide()" id="slideDeleteButton">Delete</button>
                        <button onclick="showNewSlideOptions()" id="slideCreateButton">Add New Slide</button>
                    </form>
                </fieldset>
            </div>
        </div>
        <button onclick="pageSnapshot(new Slide())" >DO IT</button>
    </body>
</html>
