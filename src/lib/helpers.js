const bcryp = require('bcryptjs')

const helpers = {};

/**
 * ENCRIPTAR LA CONTRASEÑA 
 * @param password => Contraseña en texto plano 
 * @returns => Contraseña cifrada gracias a la librería bcryp
 */
helpers.encryptPassword = async (password) => {
    const salt = await bcryp.genSalt(10); // Genera un hash, un algoritmo para darle seguridad a la contraseña, en este caso el algoritmo se repite 10 veces
    const encryptPasswordUser = await bcryp.hash(password, salt); // Encripta la contraseña
    return encryptPasswordUser;
}

/**
 * VERIFICAR CONTRASEÑA EN LA BASE DE DATOS PARA EL LOGIN
 * @param password => Toma la contraseña que ingresó el usuario
 * @param savedPassword => Contraseña guardada en la base de datos 
 * @returns => La comparación de las contraseñas con un try/catch
 */
helpers.matchPassword = async (password, savedPassword) => {
    try{
        return await bcryp.compare(password, savedPassword);
    } catch(e) {
        console.log(e);
    }
}

module.exports = helpers;