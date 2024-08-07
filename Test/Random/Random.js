var Random;
(function (Random) {
    var ƒ = FudgeCore;
    class Result {
    }
    let seed = parseFloat(location.search.slice(1)) || undefined;
    console.log("Seed = " + seed);
    let random = new ƒ.Random(seed);
    let results = {};
    window.addEventListener("load", hndload);
    function hndload() {
        addResult("getNorm [0,1[", random.getNorm());
        addResult("getRange [-1,1[", random.getRange(-1, 1));
        addResult("getRangeFloored [-10, 10]", random.getRangeFloored(-10, 10));
        addResult("getBoolean", random.getBoolean());
        addResult("getSign", random.getSign());
        let array = ["a", "b", "c"];
        let i = random.getIndex(array);
        addResult("getIndex", i, array[i]);
        let j = random.getElement(array);
        addResult("getElement", j, array.indexOf(j));
        let k = random.splice(array);
        addResult("splice", k, array.toString());
        let s1 = Symbol("ƒudge1");
        let s2 = Symbol("ƒudge2");
        let object = { x: 10, b: true, s: "ƒudge" };
        object[s1] = "ƒudge1";
        object[s2] = "ƒudge2";
        let property = random.getPropertyName(object);
        addResult("getPropertyName", property, object[property]);
        let symbol = random.getPropertySymbol(object);
        addResult("getPropertySymbol", symbol, object[symbol]);
        let map = new Map();
        map.set(array, "Array");
        map.set(object, "Object");
        let key = random.getKey(map);
        addResult("getKey", key, map.get(key));
        let corner0 = ƒ.Vector3.ONE(-3);
        let corner1 = ƒ.Vector3.ONE(5);
        let randomVector2 = random.getVector2(corner0.toVector2(), corner1.toVector2());
        addResult("getVector2", randomVector2.toString());
        let randomVector3 = random.getVector3(corner0, corner1);
        addResult("getVector3", randomVector3.toString());
        console.table(results);
    }
    function addResult(...args) {
        let result = new Result();
        let i = 0;
        results[args[0]] = { result: args[1], comment: args[2] ? args[2] : null };
    }
})(Random || (Random = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmFuZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUmFuZG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsTUFBTSxDQWdFZjtBQWhFRCxXQUFVLE1BQU07SUFDZCxJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckIsTUFBTSxNQUFNO0tBR1g7SUFFRCxJQUFJLElBQUksR0FBVyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUM7SUFDckUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDOUIsSUFBSSxNQUFNLEdBQWEsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLElBQUksT0FBTyxHQUFrQyxFQUFFLENBQUM7SUFFaEQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUV6QyxTQUFTLE9BQU87UUFDZCxTQUFTLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsU0FBUyxDQUFDLDJCQUEyQixFQUFFLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4RSxTQUFTLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFdkMsSUFBSSxLQUFLLEdBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxHQUFX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