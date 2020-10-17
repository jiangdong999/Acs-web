const {
  JSEncrypt
} = require("jsencrypt");


export function rsaEncrypt(data) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC47pfOTeFlbjjbsfBfSJfSm/OFzAkLuQ14cn9y13y4O19fBUNhAtGZMLA6X7CDfTu5x+OMO32D7fivoG845utUGGUjkyuhXZ9xWxjYyZFR0vKsMqalQqIJQBpgQDB81YQhONhhDPPwyb/hSqrIb51bD6+hVp38aMnhfxc7FD/w4QIDAQAB') // 公钥
//   data = JSON.stringify(data)
  let getrsaData = encrypt.encryptLong(data)
  return getrsaData
}

export function rsaDecrypt(data) {
  const encrypt = new JSEncrypt()
  encrypt.setPrivateKey('MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALgWxqfdSSQZOLL0kEpgKP+MKqANKMfunYLVNI5tZ1XyhUslN4KUGVGYaX65+E6LPB95XLow0jAT/gzrVvOcaS4NAF+ms1o06mGksh6ULkQgzfZVTMwB5xKy3h9IV/8Sn/bG43ftbGS0Of1/kEhPr38eJMrvgDcQE+cloGObhtibAgMBAAECgYATJrtwB0Nur/kIFQ1Vz380Zr6ge/38HsTgMZIQJy2S8XIQiUSnHwUrSfHfrzU35qBQne2ZqS6Utd++NFWNbn46kQGUbqwAYaNnum8Kpo2jU4dJk9soGJrkwe7sVKltjm8H7zZaHeNTSkINkNwB1D5vBCSc0ht/4tUPGdOJWZQxoQJBAOReYl0s1j1CKfndp2jeYM9j6sSvTV4gkREIsdEIkH11CPAlsc6ItMqLyK/ocWc7raD4ayQ0hBhhiM3f3qhaGGkCQQDOXNkBt9BHHbC6Htgh6hAuZZKxjfOlsNPn1aSaA21i6CfNpN4RKvvGVdNg1Lh8J7MNvuySItj0DoNU391yByhjAkBENQR/+8JJLZfH7zHvGmwjxR37fLhI4sUxJz2kx0AQmIIA5+FBZIdK75ETKQOl56cmKswlViIV/huUEcc41R/xAkEAmcZOXx1eMuBJBShe3kbQ8AH4oh6pZNqzzZpCIhJTvNRKdM9aO2jQXScvcISTRNFAeAnBt9QH3zXBX8nB9mqnCQJABSyA1qpYXEd94y+C5NTQlllQyo+pOp7oMK2LMQPzqmB9/PVH8RcLPmhx4GsD622k5pWTUEgZyyHPFZI/UIgbuA==') // 私钥
  let decrsaData = encrypt.decryptLong(data)
  return decrsaData  
}
