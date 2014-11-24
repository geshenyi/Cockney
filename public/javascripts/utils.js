/**
 * Created by ssge on 2014/10/23.
 */
function Bucket(){
    bucket = {};
    this.pull = function(propertyName){
        return bucket[propertyName];
    };

    this.push = function(propertyName, propertyValue){
        bucket[propertyName] = propertyValue;
    };

    this.remove = function(propertyName){
        delete bucket[propertyName];
    };

    this.hasProperty = function(propertyName){
        return bucket[propertyName] == 'undefined';
    }
}

color = [
    {upperBgColor: '#ffd9d1', lowerBgColor: '#ff5252'},
    {upperBgColor: '#ffffbe', lowerBgColor: '#ffeb3b'},
    {upperBgColor: '#acffff', lowerBgColor: '#03A9F4'},
    {upperBgColor: '#ffc2ff', lowerBgColor: '#7e57c2'},
    {upperBgColor: '#b9f6ca', lowerBgColor: '#1de9b6'},
    {upperBgColor: '#ffd18c', lowerBgColor: '#ffac30'}
];

