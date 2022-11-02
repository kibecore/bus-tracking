const dataApi = [];
const latlang = [];

function getTimeStamp(input) {
    var parts = input.trim().split(' ');
    var date = parts[0].split('-');
    var time = (parts[1] ? parts[1] : '00:00:00').split(':');
    var d = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
    return d.getTime() / 1000;
}
function getDate(input) {
    var date = new Date(input * 1000);
    var hours = date.getHours();

    if (hours < 10) hours = '0' + hours;
    var minutes = '0' + date.getMinutes();
    var seconds = '0' + date.getSeconds();

    var showTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return showTime;
}
function handleSpeed(e, trackplayback) {
    const speedOption = document.createElement('div');
    speedOption.classList.add('speed-option');
    speedOption.classList.add('animate__animated');
    speedOption.classList.add('animate__fadeInRight');
    speedOption.innerHTML = `
                    <span value='1'>1X</span>
                    <span value='2'>2X</span>
                    <span value='5'>5X</span>
                    <span value='10'>10X</span>
                    <span value='12'>12X</span>
                    `;

    if (e.target.parentElement.lastChild.className.includes('speed-option')) {
        e.target.parentElement.lastChild.remove();
    } else {
        e.target.parentElement.appendChild(speedOption);
        document.querySelector('.speed-option').onclick = (e) => {
            if (e.target.closest('span')) {
                const value = e.target.closest('span').getAttribute('value');
                trackplayback.setSpeed(Number(value));
                document.querySelector('.info-speed-ratio').innerHTML = `${value}X`;
                e.target.closest('span').parentElement.remove();
            }
        };
    }
}

fetch('https://api.midvietnam.com/studyapi/getdatagps')
    .then((response) => {
        return response.json();
    })
    .then((posts) => {
        posts.tracks.forEach((post) => {
            const location = post.location.split(',');
            dataApi.push({
                lng: Number(location[1]),
                lat: Number(location[0]),
                dir: Number(post.direction),
                time: getTimeStamp(post.time),
                heading: 62,
                speed: Number(post.speed),
                info: [Number(post.speed)],
                s1: post.s1,
            });

            latlang.push([Number(location[0]), Number(location[1])]);
        });
        var list = document.querySelector('.item');
        var diaLog = document.createElement('div');
        // console.log(list);
        if (list) {
            list.classList.add('aoeui');
            list.id = obj.time;
        }

        var map = L.map('map').setView([19.068246, 105.891393], 7.5);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        function clickSpeed(e, trackPlayBack) {
            document.getElementsByClassName('info-speed-ratio').onclick = (e) => {
                tool.handleSpeed(e, trackPlayBack);
            };
        }

        L.marker([19.068246, 105.891393]).addTo(map).bindPopup('Bắt đầu').openPopup();

        const trackplayback = L.trackplayback(dataApi, map);

        // Optional  (only if you need plaback control)
        const trackplaybackControl = L.trackplaybackcontrol(trackplayback);

        trackplaybackControl.addTo(map);
        trackplayback.showTrackLine();
        var polyline = L.polyline(latlang, { color: 'red' }).addTo(map);
        trackplayback.setSpeed(5);

        if (document.querySelector('.info-speed-ratio')) {
            document.querySelector('.info-speed-ratio').onclick = (e) => {
                handleSpeed(e, trackplayback);
            };
        }
        viewConnet(posts.tracks, map, trackplayback);
    })

    .then((post) => {
        var d = 0;
        dataApi.map((i) => {
            if (d % 2 == 0) {
                document
                    .getElementById('vehicle-user')
                    .insertAdjacentHTML(
                        'beforeend',
                        '<div class="item" id="' +
                            i.time +
                            '">' +
                            '<p>' +
                            getDate(i.time) +
                            '</p>' +
                            ' | ' +
                            i.lat +
                            ' - ' +
                            i.lng +
                            '</div>',
                    );
            } else {
                document
                    .getElementById('vehicle-user')
                    .insertAdjacentHTML(
                        'beforeend',
                        '<div class="item background" id="' +
                            i.time +
                            '">' +
                            '<p>' +
                            getDate(i.time) +
                            '</p>' +
                            ' | ' +
                            i.lat +
                            ' - ' +
                            i.lng +
                            '</div>',
                    );
            }
            d++;
        });
    })
    .then((showData) => {
        var item = document.querySelectorAll(".item");
        var modal = document.querySelector(".boder-header");
        var modalItem = document.getElementById("item-card");
        var close = document.querySelector(".modal-close");
        var inter = "Yếu";
        var d = 0;
        list.forEach((item, i) => {
            item.addEventListener("click", function () {
                modal.style.display = "none";
                modal.style.display = "flex";
                var s =
                    "<div>Biển số: " +
                    dataApi[i].licence_plate +
                    "</div><div>Vị trí: " +
                    dataApi[i].lat +
                    "-" +
                    dataApi[i].lng +
                    "</div><div>Tốc độ: " +
                    dataApi[i].speed +
                    " knots" +
                    "</div><div>Trạng thái: Đang chạy</div><div>Tín hiệu mạng: " +
                    inter;
                modalItem.innerHTML = s;
                d++;
            });
            close.addEventListener("click", function () {
                modal.style.display = "none";
            });
        });
    });


console.log('ok');
var show = document.querySelector('#open');
var hide = document.querySelector('#close');
var left = document.querySelector('.boder-vehicle');
var main = document.querySelector('.map');

hide.addEventListener('click', function () {
    left.style.display = 'none';

    show.style.display = 'block';
    hide.style.display = 'none';
    hide.style.color = 'white';
    console.log('d');
});
show.addEventListener('click', function () {
    left.style.display = 'block';

    hide.style.display = 'block';
    show.style.display = 'none';
});
// console.log('did1');
function viewConnet(data, map, trackplayback) {
    const viewModeEl = document.createElement('div');
    viewModeEl.classList.add('view-mode');
    viewModeEl.innerHTML = `
        <div class ="choose-view-mode">
            <span>Chế độ xem</span>
            <i class="fas fa-sort-down"></i>
        </div>
        `;

    const optionViews = document.createElement('div');
    optionViews.classList.add('option-view');
    optionViews.classList.add('animate-height-hidden');
    // optionViews.style.display = 'none';
    optionViews.innerHTML = `
        <div view-mode= '0' class='option_'>Hành trình</div>
        <div view-mode= '1' class='option_'>Tín hiệu mạng</div>
        `;

    const descriptionView = document.createElement('div');
    descriptionView.classList.add('description-view');
    descriptionView.style.display = 'none';
    descriptionView.innerHTML = `
        <div class='description_'> <div class='line_' style='background-color: #000000 '></div> <p>Offline</p> </div>
        <div class='description_'> <div class='line_' style='background-color: #8e22c3 '></div> <p>Lost</p> </div>
        <div class='description_'> <div class='line_' style='background-color: #f2e735 '></div> <p>Weak - 2G</p> </div>
        <div class='description_'> <div class='line_' style='background-color: #e1391f '></div> <p>3G</p> </div>
        <div class='description_'> <div class='line_' style='background-color: #0000f6 '></div> <p>4G-5G</p> </div>
        `;

    viewModeEl.appendChild(optionViews);
    viewModeEl.appendChild(descriptionView);

    //handleEvent
    viewModeEl.onclick = (e) => {
        if (e.target.closest('.choose-view-mode')) {
            optionViews.classList.toggle('animate-height-show');
            optionViews.classList.toggle('animate-height-hidden');
        }
    };

    optionViews.onclick = (e) => {
        optionViews.classList.toggle('animate-height-show');
        optionViews.classList.toggle('animate-height-hidden');

        const viewCode = e.target.closest('.option_').getAttribute('view-mode');
        if (Number(viewCode) === 1) {
            descriptionView.style.display = 'flex';
        } else {
            descriptionView.style.display = 'none';
        }

    };

    const mapViewBottomLeft = document.querySelector('.leaflet-bottom');
    mapViewBottomLeft.appendChild(viewModeEl);
}

function drawItinerary(data, map, trackplayback, viewCode) {
    const dataLength = data.length;
    tool.clearMap(map);
    var latlngs = [];

    if (viewCode === 1) {
        trackplayback.hideTrackLine(); 
        const binary_ = Number(data[0].s1).toString(2).slice(-13, -10);
        var decimal_ = parseInt(binary_, 2);
        var color;
        var timeDistance = 0;
        for (let i = 0; i < dataLength; i++) {
            const binary = Number(data[i].s1).toString(2).slice(-13, -10);
            const decimal = parseInt(binary, 2);
            if (i > 0) {
                timeDistance = data[i].time - data[i - 1].time;
            }
            if (decimal === decimal_ && timeDistance < 300) {
                latlngs.push([data[i].lat, data[i].lng]);
                if (i >= dataLength - 1) {
                    L.polyline(latlngs, { color: color }).addTo(map);       
                }
            } else {
                if (timeDistance >= 300) {
                    console.log(timeDistance);
                    color = '#000000';
                    decimal_ = decimal;
                    L.polyline(
                        [
                            [data[i].lat, data[i].lng],
                            [data[i - 1].lat, data[i - 1].lng],
                        ],
                        { color: color },
                    ).addTo(map);
                } else {
                    latlngs.push([data[i].lat, data[i].lng]);
                }
                if (decimal_ === 1 || decimal_ === 2) {
                    color = '#f2e735';
                } else if (decimal_ === 0) {
                    color = '#8e22c3';
                } else if (decimal_ === 3) {
                    color = '#e1391f';
                } else if (decimal_ === 4 || decimal_ === 5) {
                    color = '#0000f6';
                }
                decimal_ = decimal;
                L.polyline(latlngs, { color: color }).addTo(map);
                latlngs = [];
            }
        }
    }
    if (viewCode === 0) {
        trackplayback.showTrackLine();
        for (let i = 0; i < dataLength; i++) {
            latlngs.push([data[i].lat, data[i].lng]);
        }

        polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);
    }
}
