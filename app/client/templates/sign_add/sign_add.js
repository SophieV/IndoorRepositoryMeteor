Template.sign_add.helpers({
  isOwner: function () {
      return this.owner === Meteor.userId();
  },
  isIdentified: function () {
    return Meteor.userId() != null;
  },
  isDevice: function() {
    return Meteor.isCordova;
  }
});

Template.sign_add.onCreated(function(){
  this.sign_picture = new ReactiveVar(null);
});

Template.sign_add.events({
  "reset .new-sign": function (event, template) {
    clearFormData(event.target);
  },
  "submit .new-sign": function (event, template) {
    var requiredFieldsPopulated = new ReactiveVar(true);
    
    try
    {
      var TextPopulated = Match.Where(function (text) {
        check(text, String);
        return text.length > 0;
      });

      check(event.target.sign_type.value, TextPopulated);
      check(event.target.sign_floor.value, TextPopulated);
      check(event.target.sign_room.value, TextPopulated);
    }
    catch (err)
    {
      event.preventDefault();
      requiredFieldsPopulated.set(false);
      console.log('Not all required fields are populated');
    }

    if (requiredFieldsPopulated.get())
    {
      Meteor.call("addSign", event.target.sign_type.value, event.target.sign_floor.value, event.target.sign_room.value, event.target.sign_details.value);

      clearFormData(event.target);
    }

    return false;
  }
});

Template.take_camera_picture.events({
  'click button': function (event, template) {
    getSignPicture({
      width: 350,
      height: 350,
      quality: 75
    }, template);
  }
});

Template.browse_library_pictures.events({
  'click button': function (event, template) {
    if (Meteor.isCordova) {
      getSignPicture({
        width: 350,
        height: 350,
        quality: 75,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      }, template);
    } else {
      alert('Cordova only feature.');
    }
  }
});

Template.show_sign_picture.helpers({
  sign_picture: function() {
    return Template.instance().closestInstance("sign_add").sign_picture.get();
  }
});

function getSignPicture(options, template) {
  MeteorCamera.getPicture(options, function(err, data) {
    if (err) {
      console.log('error', err);
    }
    if (data) {
      var parent = template.closestInstance("sign_add");
      parent.sign_picture.set(data);
    }
  });
};

function clearFormData(form){
  form.sign_type.value = "";
  form.sign_floor.value = "";
  form.sign_room.value = "";
  form.sign_details.value = "";
};