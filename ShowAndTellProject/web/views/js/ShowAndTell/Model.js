/* 
 * This script contains constructors that are used to construct objects that
 * are compatible with the server side JavaBeans.
 */

/**
 * Constructs a new Entity object that is compatible with the server side
 * Entity class.
 */
function Entity() {
    this.lectureID = currentLecture.lectureID;
    this.pageID = currentPage.pageID;
    this.entityID  = "hahaNo";
    this.entityType = "OH SHI-";
    this.entityX = "50"; // default to a 50x50 offset
    this.entityY = "50";
    this.entityZ = "1"; // yeah why not
    this.animation = "None"; //we can't afford to hire animators!
    this.entityContent = ""; //null is for errors
    this.entityWidth = "50";
    this.entityHeight = "50";
}

/**
 * Constructs a new Page object that is compatible with the server side
 * Page class.
 */
function Page() {
    this.lectureID = currentLecture.lectureID;
    this.pageID    = "some value";
    this.pageSequence = "0";
    this.pageAudioURL = "no audio here";
}

/**
 * Constructs a new Lecture object that is compatible with the server side
 * Lecture class.
 */
function Lecture() {
    this.lectureID = "some value";
    this.lectureTitle = "Lecture Title";
    this.courseTitle = "Course Title";
    this.instructor = "Instructor Name";
}


