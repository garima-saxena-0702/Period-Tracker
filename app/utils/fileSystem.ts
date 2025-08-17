import * as FileSystem from 'expo-file-system';
import { FILE_DIRECTORY } from './constants';
/**
 * Ensures the directory for storing files exists.
 * Creates the directory if it doesn't already exist.
 */
const ensureDirectoryExists = async (): Promise<void> => {
  const dirInfo = await FileSystem.getInfoAsync(FILE_DIRECTORY);
  if (!dirInfo.exists) {
    console.log("Directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(FILE_DIRECTORY, { intermediates: true }); //intermediates: true creates parent directories as needed
  }
};

/**
 * Writes content to a specified file.
 * If the file or directory doesn't exist, it will be created.
 * @param fileName The name of the file to write to (e.g., "mydata.txt").
 * @param content The string content to write to the file.
 * @returns A Promise that resolves to true on success, false on failure.
 */
export const writeToFile = async (fileName: string, content: string): Promise<boolean> => {
  try {
    await ensureDirectoryExists();
    const fileUri = FILE_DIRECTORY + fileName;
    await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });
    console.log(`Content written to file: ${fileUri}`);
    return true;
  } catch (error) {
    console.error(`Error writing to file ${fileName}:`, error);
    return false;
  }
};

/**
 * Reads content from a specified file.
 * @param fileName The name of the file to read from (e.g., "mydata.txt").
 * @returns A Promise that resolves with the file's content as a string, or null if the file doesn't exist or an error occurs.
 */
export const readFromFile = async (fileName: string): Promise<string | null> => {
  try {
    await ensureDirectoryExists(); // Ensure directory exists even for reading
    const fileUri = FILE_DIRECTORY + fileName;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
      console.log(`Content read from file: ${fileUri}`);
      return content;
    } else {
      console.log(`File ${fileName} does not exist.`);
      return null;
    }
  } catch (error) {
    console.error(`Error reading from file ${fileName}:`, error);
    return null;
  }
};

/**
 * Creates an empty file at the specified path if it doesn't exist.
 * This is primarily used as a fallback if `writeToFile` fails due to a non-existent file,
 * though `writeToFile` already handles directory creation.
 * @param fileName The name of the file to create (e.g., "log.txt").
 * @returns A Promise that resolves to true on success, false on failure.
 */
export const createFile = async (fileName: string): Promise<boolean> => {
  try {
    await ensureDirectoryExists();
    const fileUri = FILE_DIRECTORY + fileName;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      await FileSystem.writeAsStringAsync(fileUri, '', { encoding: FileSystem.EncodingType.UTF8 });
      console.log(`File ${fileName} created.`);
      return true;
    } else {
      console.log(`File ${fileName} already exists.`);
      return true; // Consider it a success if the file already exists
    }
  } catch (error) {
    console.error(`Error creating file ${fileName}:`, error);
    return false;
  }
};

