const hotelList = document.querySelector('#hotels-list');
const form = document.querySelector("#add-hotel-form");
//after retrieving elements send them to DOM as UL

function renderHotel(doc){
    let li = document.createElement("li");
    let name = document.createElement("span");
    let city = document.createElement("span");
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name; 
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.append(name);
    li.append(city);
    li.appendChild(cross); 

    hotelList.appendChild(li);

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        database.collection('hotels').doc(id).delete();
    });
}
//getting data
/*database.collection('hotels').where('city','==','Karachi').orderBy('name').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderHotel(doc);
    })
})*/

form.addEventListener('submit', (e) => {
    e.preventDefault();
    database.collection('hotels').add({
        name: form.name.value,
        city: form.city.value,
    });
    form.name.value = '';
    form.city.value = '';
})

database.collection('hotels').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();

    changes.forEach(change => {
        if (change.type == 'added'){
            renderHotel(change.doc);
        } else if (change.type == 'removed') {
            let li = hotelList.querySelector('[data-id= '+ change.doc.id + ']');
            hotelList.removeChild(li);
        }
    })
})

database.collection('hotels').doc('VAxPcJaGrp44JbUKhtau').update({
    city: "Islamabad"
});
