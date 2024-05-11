export class IdMapper {
  static toDomain (result: any) {
    const { _id, ...dataWithoutId } = result;
    return { ...dataWithoutId, id: _id.toString() };
  }
}
