import { nanoid } from 'nanoid';

export const generateUniqueNumericId = (length = 10) => {
  // Generate a unique ID using nanoid
  const uniqueId = nanoid(length);

  // Convert the unique ID to a number
  // Note: This will not be a pure number, but a numeric representation of the string
  const numericId = parseInt(uniqueId, 36); // Convert from base-36 to base-10

  return numericId;
};
