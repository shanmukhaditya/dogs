import dogBreeds from './breeds.js'
import chai from 'chai';
import axios from 'axios';

var expect = chai.expect;

async function test_fetch(query) {

    var requestStatus;
    var breed = query.breed;
    var data = { 'message': [] }
    var message;

    if (breed) {
        // console.log(breed);
        const resp = await axios.get(`https://dog.ceo/api/breed/${breed.replace('-', '/')}/images`)
            .catch((error) => {
                if (error.response) {
                    requestStatus = error.response.status;
                    message = `${requestStatus} - Photos not found for the breed`;
                }
            });
        if (resp) {
            data = resp.data;
            requestStatus = resp.status;
        }
    }

    return {
                requestStatus: requestStatus,
                breed: breed,
                images: data.message ? data.message : [],
                dropdown: dogBreeds,
                message: message
            }

}

describe('Testing the fetch function', function () {
    it('1. Fetch with undefined breed value', function (done) {
        
        Promise.resolve(test_fetch({})).then((ansDict)=>{

            expect(ansDict.requestStatus).to.equal(undefined);
            expect(ansDict.breed).to.equal(undefined);
            expect(ansDict.images.length).to.equal(0);
            expect(ansDict.dropdown).to.equal(dogBreeds);
            
        }).then(done, done);
        
    });

    it('2. Fetch with empty breed value', function (done) {
        Promise.resolve(test_fetch({breed:''})).then((ansDict)=>{

            // console.log(ansDict.dropdown);

            expect(ansDict.requestStatus).to.equal(undefined);
            expect(ansDict.breed).to.equal('');
            expect(ansDict.images.length).to.equal(0);
            expect(ansDict.dropdown).to.equal(dogBreeds);
            // done();
        }).then(done, done);
    });

    it('3. Fetch with valid breed name', function (done) {
        Promise.resolve(test_fetch({breed:'bulldog-english'})).then((ansDict)=>{

            // console.log(ansDict.dropdown);

            expect(ansDict.requestStatus).to.equal(200);
            expect(ansDict.breed).to.equal('bulldog-english');
            expect(ansDict.images.length).to.greaterThan(0);
            expect(ansDict.dropdown).to.equal(dogBreeds);
            
        }).then(done, done);
        
    });

    it('4. Fetch with breed that does not exist', function (done) {
        Promise.resolve(test_fetch({breed:'does-not-exist'})).then((ansDict)=>{

            expect(ansDict.requestStatus).to.equal(404);
            expect(ansDict.breed).to.equal('does-not-exist');
            expect(ansDict.images.length).to.equal(0);
            expect(ansDict.dropdown).to.equal(dogBreeds);
            
        }).then(done, done);
        
    });

});