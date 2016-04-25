function Lecture(ml) {
    this.id = ml ? ml.lectureID : "";
    this.lectureTitle = ml ? ml.lectureTitle : "Lecture Title";
    this.courseTitle = ml ? ml.courseTitle : "Course Title";
    this.instructor = ml ? ml.instructor : "Instructor Name";
    this.status = ml ? "unchanged" : "added";
}

function ModelLecture(l) {
    this.lectureID = l.id;
    this.lectureTitle = l.lectureTitle;
    this.courseTitle = l.courseTitle;
    this.instructor = l.instructor;
}

function createLecture(){
    var lec = { test : { one : "a", two : "b", three : "c"}, test2 : {one : "a", two : "b"}};
    $.post("/ShowAndTellProject/Controller", {
        action: "newLecture",
        "lecture": JSON.stringify([new ModelLecture(new Lecture()), new ModelLecture(new Lecture())])//JSON.stringify([new ModelLecture(new Lecture()), new ModelLecture(new Lecture())])
    });
}

function editLecture(){
    var id = $("#lecture").val();
    $.post("/ShowAndTellProject/Controller", {
        id: id,
        action: "changeLecture",
        success: function (res) {
            document.location.href = document.location.href;
        }
    });
}

function deleteLecture() {
    var id = $("#lecture").val();
    var lecture = new Lecture();
    lecture.id = id;
    $.post("/ShowAndTellProject/Controller", {
        lecture: JSON.stringify(new ModelLecture(lecture)),
        action: "deleteLecture",
        success: function (res) {
            document.location.href = document.location.href;
        }
    });
}
