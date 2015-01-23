describe('EntityUpdater', function(){
  beforeEach(function(){
    module('carnival');
    inject(function(_EntityUpdater_, _Configuration_, _ActionFactory_){
      EntityUpdater = _EntityUpdater_;
    });
  });

  describe('#updateEntity', function(){
    var parentEntity, entity;
    beforeEach(function(){
      parentEntity = {
        name: 'posts',
        datas: {
          category: {
            id: 3,
            name: 'Category3'
          },
          comments: [
            {id: 1, name: 'comment1'},
            {id: 2, name: 'comment2'}
          ]
        },
        relatedResources: {
          comments: [
            {id: 1, name: 'comment1'},
            {id: 2, name: 'comment2'}
          ],
          categories: []
        },

        fields: [
          {
            name: 'comments',
            entityName: 'comments',
            endpoint: 'comments',
            type: 'hasMany',
            identifier: 'id',
            field: 'name'
          },
          {
            name: 'category',
            entityName: 'categories',
            endpoint: 'categories',
            type: 'belongsTo',
            identifier: 'id',
            field: 'name'
          }
        ]
      };
    });

    describe('updateBelongsToField', function(){

      var fieldData = {
        id: 10,
        name: 'newCategory'
      };

      beforeEach(function(){
        entity = {
          name: 'categories'
        };
        entity.parentEntity = parentEntity;
      });

      it('should update parentEntity', function(){

        EntityUpdater.updateEntity(parentEntity, parentEntity.fields[1], fieldData);
        expect(parentEntity.datas.category.id).to.be.equal(fieldData.id);
        expect(parentEntity.relatedResources.categories.length).to.be.equal(1);

      });
    });

    describe('updateHasManyField', function(){

      var fieldData = {
        id: 10,
        name: 'comment10'
      };

      beforeEach(function(){
        entity = {
          name: 'comments'
        };
        entity.parentEntity = parentEntity;
      });

      it('should update parentEntity', function(){

        EntityUpdater.updateEntity(parentEntity, parentEntity.fields[0], fieldData);
        expect(parentEntity.datas.comments.length).to.be.equal(3);
        expect(parentEntity.relatedResources.comments.length).to.be.equal(3);
      });

      describe('when are updating a nested item', function(){
        it('should update the item', function(){
          var updateData = parentEntity.datas.comments[0];
          updateData.name = 'updatedCommnet';
          EntityUpdater.updateEntity(parentEntity, parentEntity.fields[0], updateData);
          expect(parentEntity.datas.comments.length).to.be.equal(2);
          expect(parentEntity.datas.comments[0].name).to.be.equal(updateData.name);
          expect(parentEntity.relatedResources.comments.length).to.be.equal(2);
        });
      });

    });
  });

});
