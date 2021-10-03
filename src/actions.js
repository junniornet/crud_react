import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import db from './firebase'

export const getCollection = async(coleccion) => {
const result = { statusResponse: false, data: null, error: null}
try {
    const data = await getDocs(collection(db, coleccion))
    const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data()}))
    result.statusResponse=true
    result.data=arrayData
} catch (error) {
    result.error=error
}
return result
}

export const addDocument = async(coleccion, data) => {
    const result = { statusResponse: false, data: null, error: null}
    try {
        const response = await addDoc(collection(db, coleccion), data)
        result.data = {id: response.id}
        result.statusResponse = true
    } catch (error) {
        result.error=error
    }
return result
}

export const getDocument = async(coleccion, id) =>{
    const result = { statusResponse: false, data: null, error: null}
    try {
        const data = doc(db, coleccion, id)
        const response = await getDoc(data)
        result.data = { id: response.id, ...response.data() }
        result.statusResponse=true
    } catch (error) {
        result.error=error
    }
    return result
}

export const updateDocument = async(coleccion, id, data) => {
    const result = { statusResponse: false, error: null}
    try {
        const documento = doc(db, coleccion, id)
        await updateDoc(documento, data)
        result.statusResponse= true
    } catch (error) {
        result.error= error
    }
    return result
}

export const deleteDocument = async(coleccion, id) =>{
    const result = { statusResponse: false, error: null}
    try {
        const documento = doc(db, coleccion, id)
        await deleteDoc(documento)
        result.statusResponse= true
    } catch (error) {
        result.error=error
    }
    return result
}