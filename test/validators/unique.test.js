
var Schema = require('jugglingdb').Schema;
var unique = require('../../lib/validators/unique');

describe('Test `unique` validator', function() {
//  var model = db.Shema
  var customMessage = "Testing unique successful!";
  var db = new Schema('memory');
  var Model = db.define('Model', {
      key: {type: String, index: true}
  });

  beforeEach(function(done) {
    Model.destroyAll(done);
  });
  afterEach(function() {

  });

  it('should validate', function(done) {
    var model = new Model({ key: "foo" });
    var otherModel = new Model({ key: "bar" });

    // async validator requires a 4th argument...
    unique(model, 'key', undefined, function(valid) {
      valid.should.be.true;

      model.save(function(err) {
        if (err) throw err;

        unique(otherModel, 'key', undefined, function(otherValid) {
          otherValid.should.be.true;
          done();
        });
      });
    });
  });

  it('should not validate', function(done) {
    var model = new Model({ key: "foo" });
    var otherModel = new Model({ key: "foo" });

    // async validator requires a 4th argument...
    unique(model, 'key', undefined, function(valid) {
      valid.should.be.true;

      model.save(function(err) {
        if (err) throw err;

        unique(otherModel, 'key', undefined, function(otherValid) {
          otherValid.should.not.be.true;
          otherValid.should.be.a('string');
          done();
        });
      });
    });
  });

  it('should allow changing the error message', function(done) {
    var model = new Model({ key: "foo" });
    var otherModel = new Model({ key: "foo" });

    // async validator requires a 4th argument...
    unique(model, 'key', undefined, function(valid) {
      valid.should.be.true;

      model.save(function(err) {
        if (err) throw err;

        unique(otherModel, 'key', { message: customMessage }, function(otherValid) {
          otherValid.should.not.be.true;
          otherValid.should.equal(customMessage);
          done();
        });
      });
    });
  });

});
