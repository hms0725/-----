export const isEdited = (data: any) => {
  return data.editAt ? true : false;
};
export const isEditedComment = (data: any) => {
  return data.updatedAt > data.createdAt ? true : false;
};
