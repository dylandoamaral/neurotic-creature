/*
 * File Created: Monday, 29th October 2018 8:42:00 am
 * Author: Dylan DO AMARAL (do.amaral.dylan@gmail.com)
 * -----
 * Copyright 2018 - Dylan DO AMARAL
 */

var INNOVATION = 0;
var NODEID = 0;

class Network {
    constructor(input, output, options = {}) {
        this.input = input;
        this.output = output;
        if(NODEID < input + output) NODEID = input + output;

        this.nodes = [];
        this.connections = [];
        this.maxInnovation = 0;

        this.fitness = 0;

        this.options = Object.assign({}, {
            mutationWeightRatio: 0.1,
            mutationWeightRandomRatio: 0.1,
            mutationNodeRatio: 0.03,
            mutationConnectionRatio: 0.05,
            disableRatio: 0.75,
            distanceFactor: [1.0, 1.0, 0.4]
        }, options);

        for (let i = 0; i < input; i++) {
            this.nodes = [...this.nodes, new Node(this.nodes.length, TYPE.INPUT)];
        }

        for (let i = 0; i < output; i++) {
            this.nodes = [...this.nodes, new Node(this.nodes.length, TYPE.OUTPUT)];
        }
    }

    think(inputs) {
        var count = 0;

        for (let i = 0; i < inputs.length; i++) {
            this.nodes[i].value = inputs[i];
            
        }
        let todo = this.nodes.slice();
        todo.splice(0, inputs.length);

        while(todo.length != 0 && count < 30){
            count++;
            for (const node of todo) {
                let value = 0;
                let connected = false;
                let impossible = false; // true if we don't have every value of from nodes
                for (const connection of this.connections) {
                    if(connection.toID == node.id && !connection.disable){
                        let fromNode = this.getNode(connection.fromID);
                        if(fromNode.value){
                            connected = true;
                            value += connection.weight * fromNode.value;
                        }else{
                            impossible = true;
                        }
                    }
                    if(impossible) break;
                }
                if(!impossible && connected){
                    node.value = logistic_function(value);
                    todo.splice(todo.indexOf(node), 1);
                }
            }
        }
    }

    predict(inputs){
        let outputNodes = [];
        let bestOutput = 0;

        this.think(inputs);

        for (const node of this.nodes) {
            if(node.type == TYPE.OUTPUT) outputNodes = [...outputNodes, node];
        }

        for (let i = 1; i < outputNodes.length; i++) {
            if(outputNodes[i].value > outputNodes[bestOutput].value) bestOutput = i;
        }

        if(outputNodes[bestOutput].value == 0) bestOutput = -1;
        return bestOutput;
    }


    test(tests) {
        this.fitness = 0;
        for (const test of tests) {
            let output = this.think(test.inputs)
            if(Math.round(output) == test.output) this.fitness += 1;
        }
    }

    distance(network) {
        let N = 0, L = 0, E = 0, D = 0, W = 0;

        // N : number of connection of the largest network
        // L : number of connection of the lowest network
        N = this.connections.length;
        L = network.connections.length;
        if (N < L) {
            let tmp = N;
            N = L;
            L = tmp;
        }

        // E : number of excess gene
        // D : number of disjoint gene
        for (let i = 0; i < N; i++) {
            if (this.connections[i] && network.connections[i]) {
                // Matching connection
                W += (this.connections[i].weight - network.connections[i].weight);
            } else if (this.connections[i] || network.connections[i]) {
                if (i >= L) {
                    // Excess connection
                    E++;
                } else {
                    // Disjoint connection
                    D++;
                }
            }
        }

        W = Math.abs(W);
        if(N < 20) N = 1; // Allows more species for not advanced population (less than 20 genes)

        return this.options.distanceFactor[0] * E / N + this.options.distanceFactor[1] * D / N + W;
    }

    /**
     * Mutation functions
     */

    mutation(){
        this.mutation_addConnection();
        this.mutation_addNode();
        this.mutation_weight();
    }

    mutation_addConnection() {
        if(Math.random() > this.options.mutationConnectionRatio) return;
        let copyNodes = this.nodes.slice();
        let fromIndex = randInt(copyNodes.length);

        let from = copyNodes[fromIndex];
        copyNodes.splice(fromIndex, 1);
        let to = copyNodes[randInt(copyNodes.length)];

        let reverse = false;
        if(from.type == TYPE.INPUT && to.type == TYPE.INPUT) return;
        else if (from.type == TYPE.OUTPUT && to.type == TYPE.HIDDEN) reverse = true;
        else if (from.type == TYPE.HIDDEN && to.type == TYPE.INPUT) reverse = true;
        else if (from.type == TYPE.OUTPUT && to.type == TYPE.INPUT) reverse = true;

        if (reverse) {
            let tmp = from;
            from = to;
            to = tmp;
        }

        if (!this.connectionExist(from.id, to.id)) {
            this.addConnection(from.id, to.id);
        }else{
            this.mutation_addConnection();
        }
    }

    mutation_addNode() {
        if(Math.random() > this.options.mutationNodeRatio) return;
        if (this.connections.length == 0) return;

        let connection = this.connections[randInt(this.connections.length)];
        while(connection.disable){
            connection = this.connections[randInt(this.connections.length)];
        }
         //Select the connection to be split

        let new_node = new Node(NODEID++, TYPE.HIDDEN);
        this.nodes = [...this.nodes, new_node];

        // We add connections between the new node
        this.addConnection(connection.fromID, new_node.id, 1);
        this.addConnection(new_node.id, connection.toID, connection.weight);

        //We remove the previous connection
        connection.disable = true;
    }

    mutation_weight() {
        for (const connection of this.connections) {
            if (Math.random() < this.options.mutationWeightRatio) {
                if (Math.random() < this.options.mutationWeightRandomRatio) {
                    connection.weightRandom();
                } else {
                    connection.weightPerturbation();
                }
            }
        }
    }

    /**
     * Crossover Functions
     * Partner have the worst fitness
     */

    child(partner) {
        let childNetwork = new Network(this.input, this.output, this.options);

        // Crossover
        for (const node of this.nodes) {
            if(node.type == TYPE.HIDDEN){
                childNetwork.nodes = [...childNetwork.nodes, new Node(node.id, TYPE.HIDDEN)];
            }
        }

        for (const connection of this.connections) {
            let partnerConnection = partner.getConnection(connection.innovation);
            let childConnection;
            if(partnerConnection != null){
                // Matching connection
                if (randInt(2) == 0) childConnection = connection.copy();
                else childConnection = partnerConnection.copy();

                childNetwork.connections = [...childNetwork.connections, childConnection];
            }else{
                // Excess & disjoint connection
                childConnection = connection.copy();
                childNetwork.connections = [...childNetwork.connections, childConnection];
            }
        }

        childNetwork.mutation();
        return childNetwork;
    }

    /**
     * Node Functions
     */

    getNode(id){
        for (let i = 0; i < this.nodes.length; i++) {
            if(this.nodes[i].id == id) return this.nodes[i];
        }
        return null;
    }

    /**
     * Connection Functions
     */

    addConnection(fromID, toID, weight = null) {
        this.maxInnovation = INNOVATION;
            if (weight) {
                this.connections = [...this.connections, new Connection(fromID, toID, INNOVATION++, weight)];
            } else {
                this.connections = [...this.connections, new Connection(fromID, toID, INNOVATION++)];
            }
    }

    getConnection(innovation) {
        for (const connection of this.connections) {
            if (connection.innovation == innovation) return connection;
        }
        return null;
    }

    copyConnection(fromID, toId, innovation, weight){
        if(!this.getNode(fromID)) this.nodes = [...this.nodes, new Node(fromID, TYPE.HIDDEN)];
        if(!this.getNode(toId)) this.nodes = [...this.nodes, new Node(toId, TYPE.HIDDEN)];

        this.connections = [...this.connections, new Connection(fromID, toId, innovation, weight)];
    }

    disableLastConnection(fatherConnection, motherConnection){
        if(fatherConnection.disable || motherConnection.disable){
            this.connections[this.connections.length - 1].disable = true;
        }
    }

    connectionExist(fromID, toId) {
        for (const connection of this.connections) {
            if (connection.fromID == fromID && connection.toId == toId) return true;
        }
        return false;
    }

    /**
     * Utils Functions
     */

    print() {
        console.table(this.nodes);
        console.table(this.connections);
    }

    complexity() {
        return this.connections.length + this.nodes.length;
    }


}