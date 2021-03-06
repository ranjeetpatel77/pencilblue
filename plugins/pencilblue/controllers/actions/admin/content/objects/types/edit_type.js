/*
    Copyright (C) 2014  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Edits an object type
 * @class EditObjectType
 * @constructor
 * @extends FormController
 */
function EditObjectType(){}

//inheritance
util.inherits(EditObjectType, pb.BaseController);

EditObjectType.prototype.render = function(cb) {
    var self    = this;
    var vars    = this.pathVars;

    if(!vars.id) {
        cb({
            code: 400,
            content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('INVALID_UID'))
        });
        return;
    }

    var service = new pb.CustomObjectService();
    service.loadTypeById(vars.id, function(err, custObjType) {
        if(util.isError(err) || !pb.utils.isObject(custObjType)) {
            cb({
                code: 400,
                content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('INVALID_UID'))
            });
            return;
        }

        //TODO modify this approach to check for protected properties and allow 
        //others.  Right now this will not allow additional fields if template 
        //is overriden.
        var post = self.body;
        custObjType.name = post.name;
        custObjType.fields = post.fields;
        custObjType.fields.name = {field_type: 'text'};

        service.saveType(custObjType, function(err, result) {
            if(util.isError(err)) {
                cb({
                    code: 500,
                    content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('ERROR_SAVING'))
                });
                return;
            }
            else if(util.isArray(result) && result.length > 0) {
                cb({
                    code: 500,
                    content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('ERROR_SAVING'))
                });
                return;
            }

            cb({content: pb.BaseController.apiResponse(pb.BaseController.API_SUCCESS, custObjType.name + ' ' + self.ls.get('EDITED'))});
        });
    });
};

//exports
module.exports = EditObjectType;
