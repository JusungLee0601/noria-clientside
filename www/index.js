import { View, Row, SchemaType, DataType, DataFlowGraph, Operation} from "noria-clientside";

let socketreadleft = new WebSocket("ws://localhost:3012/latencytestleft");
let counterleft = 0; 

var global_graph_initial;
var graph;

const socketrl = () => {
    socketreadleft.onopen = function(e) {
        //alert("[open] Connection established for left write");
        //alert("Sending to server");
        //socket.send("John");
    };

    socketreadleft.onmessage = function(event) {
        //alert(`[message] Data received from left server: ${event.data}`);

        if (counterleft == 0) {
            graph = DataFlowGraph.new(event.data);
            counterleft++;
        } else {
            counterleft++;
            graph.change_to_root_sc(event.data);
        }
    };

    socketreadleft.onclose = function(event) {
        if (event.wasClean) {
            alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            alert('[close] Connection died');
        }
    };

    socketreadleft.onerror = function(error) {
        alert(`[error] ${error.message}`);
    };

    console.log("reading finished left");
};

socketrl();

let socketreadright = new WebSocket("ws://localhost:3012/latencytestright");
let counterright = 0; 

const socketrr = () => {
    socketreadright.onopen = function(e) {
        //alert("[open] Connection established for right write");
        //alert("Sending to server");
        //socket.send("John");
    };

    socketreadright.onmessage = function(event) {
        //alert(`[message] Data received from right server: ${event.data}`);
        graph.change_to_root_sc(event.data);

        if (counterright == 10000) {
            //readlatencyasync();
            //readthroughputasync();
            console.timeEnd("write throughput");
        };

        counterright++;

        // if (counterright == 0) {
        //     counterright++;
        // } else {
        //     counterright++;
        //     graph.change_to_root_sc(event.data);
        // }
    };

    socketreadright.onclose = function(event) {
        if (event.wasClean) {
            alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            alert('[close] Connection died');
        }
    };

    socketreadleft.onerror = function(error) {
        alert(`[error] ${error.message}`);
    };

    console.log("reading finished right");
};

//high level, approach, implementation, experiments, results, conclusion
socketrr();

let socketwrite = new WebSocket("ws://localhost:3012/latencytestread");

const socketw = () => {
    console.log("writing");
    socketwrite.onopen = function(e) {
        //alert("[open] Connection established for write socket");
    };

    socketwrite.onmessage = function(event) {
        //alert(`[message] Broke through counter!: ${event.data}`);
        test();
    };

    socketwrite.onclose = function(event) {
        if (event.wasClean) {
            alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            alert('[close] Connection died');
        }
    };

    socketwrite.onerror = function(error) {
        alert(`[error] ${error.message}`);
    };

    console.log("writing finished");
};

socketw();

function authorStoryInserts() {
    var asInserts = [];
    var storyCount = 0;

    var i;
    var j;

    for (i = 0; i < 400; i++) {
        for (j = 0; j < 10; j++) {
            var stories = {
                root_id: "Stories", 
                changes: [
                    {
                        typing: "Insertion",
                        batch: [
                            {
                                data: [
                                    {
                                        t: "Int"
                                    },
                                    {
                                        t: "Int"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            stories.changes[0].batch[0].data[0].c = i;
            stories.changes[0].batch[0].data[1].c = storyCount;

            asInserts.push(JSON.stringify(stories));

            storyCount++;
        }
    }

    return asInserts;             
}

function authorStoryDeletes() {
    var asDeletes = [];
    var storyCount = 2000;

    var i;
    var j;

    for (i = 200; i < 400; i++) {
        for (j = 0; j < 10; j++) {
            var stories = {
                root_id: "Stories", 
                changes: [
                    {
                        typing: "Deletion",
                        batch: [
                            {
                                data: [
                                    {
                                        t: "Int"
                                    },
                                    {
                                        t: "Int"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            stories.changes[0].batch[0].data[0].c = i;
            stories.changes[0].batch[0].data[1].c = storyCount;

            asDeletes.push(JSON.stringify(stories));

            storyCount++;
        }
    }

    return asDeletes;             
};

function storyVoterInserts() {
    var svInserts = [];
    var voterCount = 0;

    var i;
    var j;

    for (i = 0; i < 2000; i++) {
        for (j = 0; j < 5; j++) {
            var stories = {
                root_id: "Votes", 
                changes: [
                    {
                        typing: "Insertion",
                        batch: [
                            {
                                data: [
                                    {
                                        t: "Int"
                                    },
                                    {
                                        t: "Int"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            stories.changes[0].batch[0].data[0].c = i;
            stories.changes[0].batch[0].data[1].c = voterCount;

            svInserts.push(JSON.stringify(stories));

            voterCount++;
        }
    }

    return svInserts;             
};

function storyVoterDeletes() {
    var svDeletes = [];
    var voterCount = 6000;

    var i;
    var j;

    for (i = 0; i < 2000; i++) {
        for (j = 0; j < 2; j++) {
            var stories = {
                root_id: "Votes", 
                changes: [
                    {
                        typing: "Deletion",
                        batch: [
                            {
                                data: [
                                    {
                                        t: "Int"
                                    },
                                    {
                                        t: "Int"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            stories.changes[0].batch[0].data[0].c = i;
            stories.changes[0].batch[0].data[1].c = voterCount;

            svDeletes.push(JSON.stringify(stories));

            voterCount++;
        }
    }

    return svDeletes;             
};

//assumes no deletes
function read_keys() {
    var reads = [];

    var i;
    var j;

    for (i = 0; i < 500; i++) {
        for (j = 0; j < 2000; j++) {
            var read_dt = {
                t: "Int"
            };

            read_dt.c = j;

            reads.push(JSON.stringify(read_dt));
        }
    }

    return reads;             
};

function read_keys_latency() {
    var read_latency = [];

    var i;
    var j;

    for (i = 0; i < 10; i++) {
        for (j = 0; j < 2000; j++) {
            var read_dt = {
                t: "Int"
            };

            read_dt.c = j;

            read_latency.push(JSON.stringify(read_dt));
        }
    }

    return read_latency;     
};

function write_sv_latency() {
    var svLatency = [];
    var voterCountInsert = 10000;

    var i;
    var j;

    for (i = 0; i < 2000; i++) {
        for (j = 0; j < 3; j++) {
            var stories = {
                root_id: "Votes", 
                changes: [
                    {
                        typing: "Insertion",
                        batch: [
                            {
                                data: [
                                    {
                                        t: "Int"
                                    },
                                    {
                                        t: "Int"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            stories.changes[0].batch[0].data[0].c = i;
            stories.changes[0].batch[0].data[1].c = voterCountInsert;

            svLatency.push(JSON.stringify(stories));

            voterCountInsert++;
        }
    }

    var voterCountDelete = 10000;

    for (i = 0; i < 2000; i++) {
        for (j = 0; j < 2; j++) {
            var stories = {
                root_id: "Votes", 
                changes: [
                    {
                        typing: "Deletion",
                        batch: [
                            {
                                data: [
                                    {
                                        t: "Int"
                                    },
                                    {
                                        t: "Int"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            stories.changes[0].batch[0].data[0].c = i;
            stories.changes[0].batch[0].data[1].c = voterCountDelete;

            svLatency.push(JSON.stringify(stories));

            voterCountDelete++;
        }
    }

    return svLatency;  
}

function write_as_latency() {
    var asLatency = [];
    var storyCountInsert = 4000;

    var i;
    var j;

    for (i = 0; i < 500; i++) {
        for (j = 0; j < 10; j++) {
            var stories = {
                root_id: "Stories", 
                changes: [
                    {
                        typing: "Insertion",
                        batch: [
                            {
                                data: [
                                    {
                                        t: "Int"
                                    },
                                    {
                                        t: "Int"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            stories.changes[0].batch[0].data[0].c = i;
            stories.changes[0].batch[0].data[1].c = storyCountInsert;

            asLatency.push(JSON.stringify(stories));

            storyCountInsert++;
        }
    }

    var storyCountDelete = 4000;

    for (i = 0; i < 500; i++) {
        for (j = 0; j < 10; j++) {
            var stories = {
                root_id: "Stories", 
                changes: [
                    {
                        typing: "Deletion",
                        batch: [
                            {
                                data: [
                                    {
                                        t: "Int"
                                    },
                                    {
                                        t: "Int"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            stories.changes[0].batch[0].data[0].c = i;
            stories.changes[0].batch[0].data[1].c = storyCountDelete;

            asLatency.push(JSON.stringify(stories));

            storyCountDelete++;
        }
    }

    return asLatency;  
}

function write_sv_latency_simple() {
    var svLatency = [];
    var voterCountInsert = 0;

    var i;
    var j;

    for (i = 0; i < 2000; i++) {
        for (j = 0; j < 5; j++) {
            var stories = {
                root_id: "Votes", 
                changes: [
                    {
                        typing: "Insertion",
                        batch: [
                            {
                                data: [
                                    {
                                        t: "Int"
                                    },
                                    {
                                        t: "Int"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            stories.changes[0].batch[0].data[0].c = i;
            stories.changes[0].batch[0].data[1].c = voterCountInsert;

            svLatency.push(JSON.stringify(stories));

            voterCountInsert++;
        }
    }

    return svLatency;  
}

function write_as_latency_simple() {
    var asLatency = [];
    var storyCountInsert = 0;

    var i;
    var j;

    for (i = 0; i < 500; i++) {
        for (j = 0; j < 20; j++) {
            var stories = {
                root_id: "Stories", 
                changes: [
                    {
                        typing: "Insertion",
                        batch: [
                            {
                                data: [
                                    {
                                        t: "Int"
                                    },
                                    {
                                        t: "Int"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            stories.changes[0].batch[0].data[0].c = i;
            stories.changes[0].batch[0].data[1].c = storyCountInsert;

            asLatency.push(JSON.stringify(stories));

            storyCountInsert++;
        }
    }

    return asLatency;  
}

const test = () => {
    var asi = authorStoryInserts();
    var adi = authorStoryDeletes();
    var svi = storyVoterInserts();
    var svd = storyVoterDeletes();
    var read_latency = read_keys_latency();
    var wsv_latency = write_sv_latency_simple();
    var was_latency = write_as_latency_simple();

    //3743
    //3740
    //3749
    //3758
    //3661
    console.time('write throughput');

    //console.time('latency');

    var write;

    for (write of asi) {
        socketwrite.send(write); 
    }

    for (write of adi) {
        socketwrite.send(write); 
    }

    for (write of svi) {
        socketwrite.send(write); 
    }

    for (write of svd) {
        socketwrite.send(write); 
    }

    //console.log("ended>");
    
    // console.time('latency');

    // var write;

    // for (write of was_latency) {
    //     socketwrite.send(write); 
    // }

    // for (write of wsv_latency) {
    //     socketwrite.send(write); 
    // }

    
    // var write;

    // for (write of asi) {
    //     socketwrite.send(write); 
    // }

    // for (write of svi) {
    //     socketwrite.send(write); 
    // }
}

//7027
//7512
//7094
//7163
//7244
const readthroughputasync = () => {
    var rk = read_keys();
    var read;

    console.time('read throughput');

    for (read of rk) {
        graph.read(3, read);
    }

    console.timeEnd('read throughput');
}

//3871
//3842
//4042
//4017
//4003
const readlatencyasync = () => {
    var rk = read_keys_latency();
    var read;

    for (read of rk) {
        graph.read(3, read);
    }

    console.timeEnd('latency');
}

const addEntry = () => {
    var articleString = parseInt(document.getElementById("article").value);
    var count = parseInt(document.getElementById("count").value);

    var stories = {
        root_id: "Stories", 
        changes: [
            {
                typing: "Insertion",
                batch: [
                    {
                        data: [
                            {
                                t: "Int"
                            },
                            {
                                t: "Int"
                            }
                        ]
                    }
                ]
            }
        ]
    };

    
    var votes = {
        root_id: "Votes", 
        changes: [
            {
                typing: "Insertion",
                batch: [
                    {
                        data: [
                            {
                                t: "Int"
                            },
                            {
                                t: "Int"
                            }
                        ]
                    }
                ]
            }
        ]
    };

    stories.changes[0].batch[0].data[0].c = articleString;
    stories.changes[0].batch[0].data[1].c = count;
    votes.changes[0].batch[0].data[0].c = articleString;
    votes.changes[0].batch[0].data[1].c = count;

    console.log(stories);
    console.log(votes);

    socketwrite.send(JSON.stringify(stories));
    socketwrite.send(JSON.stringify(votes));

    console.log("sent");
}

const refreshEntries = () => {
    console.log("Printing");
    document.getElementById("inserts").innerHTML = graph.render();
    console.log(graph.leaf_counts()[0]);
}

document.getElementById("refresh").addEventListener("click", event => {refreshEntries();});
document.getElementById("test").addEventListener("click", event => {test();});
document.getElementById("send").addEventListener("click", event => {addEntry();});

