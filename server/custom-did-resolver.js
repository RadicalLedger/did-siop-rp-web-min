import axios from 'axios';

class CustomDidResolver {
    async resolveDidDocumet(did) {
        var result;
        let url = `https://www.offchaindids.zedeid.com/v2/did/${did}`;

        try {
            result = await axios.get(url, {
                headers: {
                    Accept: 'application/json',
                    'Accept-Encoding': 'identity'
                }
            });
        } catch (error) {
            result = await axios.get(url);
        }

        if (result?.status !== 200) return undefined;

        return result?.data?.didDocument;
    }

    /**
     *
     * @param {string} did - DID to resolve the DID Document for.
     * @returns A promise which resolves to a {DidDocument}
     * @override resolve(did) method of the {DidResolver}
     * @remarks Unlike other resolvers this class can resolve Documents for many DID Methods.
     * Therefore the check in the parent class needs to be overridden.
     */
    resolve(did) {
        return this.resolveDidDocumet(did);
    }
}

export default CustomDidResolver;
