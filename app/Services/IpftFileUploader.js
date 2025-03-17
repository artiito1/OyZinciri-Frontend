export const IpfsFileUploader = async (image)=> {
    const formData = new FormData();
    formData.append('file', image);
    formData.append("network", "public"); 
    const PINATA_URL = 'https://uploads.pinata.cloud/v3/files';
    try {
        const response = await fetch(PINATA_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            },
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`Pinata API request failed with status ${response.status}`);
        }
        const data = await response.json();
        console.log(data.data.cid);
        return {
            cid: data.data.cid,
    }
    }catch (error) {
        console.error(error);  
    }
}
export const getIpfsFile = (cid) => {
    return `${process.env.NEXT_PUBLIC_PINATA_PUBLIC_GATEWAY}${cid}`;
};