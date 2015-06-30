// Generated by CoffeeScript 1.9.3
(function() {
  var Data, NameEntry, NameTable, Table, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Table = require('../table');

  Data = require('../../data');

  utils = require('../utils');

  NameTable = (function(superClass) {
    var subsetTag;

    extend(NameTable, superClass);

    function NameTable() {
      return NameTable.__super__.constructor.apply(this, arguments);
    }

    NameTable.prototype.tag = 'name';

    NameTable.prototype.parse = function(data) {
      var count, entries, entry, format, i, j, k, len, name, name1, ref, stringOffset, strings, text;
      data.pos = this.offset;
      format = data.readShort();
      count = data.readShort();
      stringOffset = data.readShort();
      entries = [];
      for (i = j = 0, ref = count; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        entries.push({
          platformID: data.readShort(),
          encodingID: data.readShort(),
          languageID: data.readShort(),
          nameID: data.readShort(),
          length: data.readShort(),
          offset: this.offset + stringOffset + data.readShort()
        });
      }
      strings = {};
      for (i = k = 0, len = entries.length; k < len; i = ++k) {
        entry = entries[i];
        data.pos = entry.offset;
        text = data.readString(entry.length);
        name = new NameEntry(text, entry);
        if (strings[name1 = entry.nameID] == null) {
          strings[name1] = [];
        }
        strings[entry.nameID].push(name);
      }
      this.strings = strings;
      this.copyright = strings[0];
      this.fontFamily = strings[1];
      this.fontSubfamily = strings[2];
      this.uniqueSubfamily = strings[3];
      this.fontName = strings[4];
      this.version = strings[5];
      this.postscriptName = strings[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
      this.trademark = strings[7];
      this.manufacturer = strings[8];
      this.designer = strings[9];
      this.description = strings[10];
      this.vendorUrl = strings[11];
      this.designerUrl = strings[12];
      this.license = strings[13];
      this.licenseUrl = strings[14];
      this.preferredFamily = strings[15];
      this.preferredSubfamily = strings[17];
      this.compatibleFull = strings[18];
      return this.sampleText = strings[19];
    };

    subsetTag = "AAAAAA";

    NameTable.prototype.encode = function() {
      var id, j, len, list, nameID, nameTable, postscriptName, ref, strCount, strTable, string, strings, table, val;
      strings = {};
      ref = this.strings;
      for (id in ref) {
        val = ref[id];
        strings[id] = val;
      }
      postscriptName = new NameEntry(subsetTag + "+" + this.postscriptName, {
        platformID: 1,
        encodingID: 0,
        languageID: 0
      });
      strings[6] = [postscriptName];
      subsetTag = utils.successorOf(subsetTag);
      strCount = 0;
      for (id in strings) {
        list = strings[id];
        if (list != null) {
          strCount += list.length;
        }
      }
      table = new Data;
      strTable = new Data;
      table.writeShort(0);
      table.writeShort(strCount);
      table.writeShort(6 + 12 * strCount);
      for (nameID in strings) {
        list = strings[nameID];
        if (list != null) {
          for (j = 0, len = list.length; j < len; j++) {
            string = list[j];
            table.writeShort(string.platformID);
            table.writeShort(string.encodingID);
            table.writeShort(string.languageID);
            table.writeShort(nameID);
            table.writeShort(string.length);
            table.writeShort(strTable.pos);
            strTable.writeString(string.raw);
          }
        }
      }
      return nameTable = {
        postscriptName: postscriptName.raw,
        table: table.data.concat(strTable.data)
      };
    };

    return NameTable;

  })(Table);

  module.exports = NameTable;

  NameEntry = (function() {
    function NameEntry(raw, entry) {
      this.raw = raw;
      this.length = this.raw.length;
      this.platformID = entry.platformID;
      this.encodingID = entry.encodingID;
      this.languageID = entry.languageID;
    }

    return NameEntry;

  })();

}).call(this);
