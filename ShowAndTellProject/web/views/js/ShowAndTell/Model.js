/* 
 * This script contains constructors that are used to construct objects that
 * are compatible with the server side JavaBeans.
 */

/**
 * Constructs a new Entity object that is compatible with the server side
 * Entity class.
 */
function Entity() {
    this.lectureID;
    this.pageID;
    this.entityID;
    this.entityType;
    this.entityX;
    this.entityY;
    this.entityZ;
    this.animation;
    this.entityContent;
    this.entityWidth;
    this.entityHeight;
}

/**
 * Constructs a new Page object that is compatible with the server side
 * Page class.
 */
function Page() {
    this.lectureID;
    this.pageID;
    this.pageSequence;
    this.pageAudioURL;
}

/**
 * Constructs a new Lecture object that is compatible with the server side
 * Lecture class.
 */
function Lecture() {
    this.lectureID;
    this.lectureTitle;
    this.courseTitle;
    this.instructor;
}


