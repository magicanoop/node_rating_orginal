
module.exports = function makeNoteDb({ NoteModel }) {
  return Object.freeze({
    findAll,
    findById,
    findOneById,
    findByTitle,
    findByCondition,
    insert,
    update,
    deleteById,
    remove
  })
  async function findAll() {
    let results = await NoteModel.find();
    return { results };
  }

  async function findById(id) {
    let results = await NoteModel.findById(id);
    return { results }
  }

  async function findOneById(id) {
    return await NoteModel.findById(id);
  }

  async function findByCondition(searchRequest, condition) {
    let results = await NoteModel
      .find((searchRequest.getFindQuery(condition)))
      .sort(searchRequest.getSortQuery())
      .limit(searchRequest.getPaginationDetails().limit)
      .skip(searchRequest.getPaginationDetails().skip)
      .select(searchRequest.getSelect()).lean()
    let total = await NoteModel.countDocuments((searchRequest.getFindQuery()));
    return { results, total };
  }

  async function findByTitle(title) {
    let note = await NoteModel.findOne({ title: title });
    return note;
  }

  async function insert(noteContent) {
    let newNote = new NoteModel(noteContent);
    return await newNote.save();
  }

  async function update(findRequest, updateQuery, options) {
    let response = await NoteModel.findOneAndUpdate(findRequest.getFindQuery(), updateQuery, options);
    return response;
  }
  async  function deleteById(id){
    const response = await NoteModel.findByIdAndRemove(id);
    return response;
  }

  async function remove(id) {
    let response = await NoteModel.findByIdAndDelete(id);
    return response;
  }

}
