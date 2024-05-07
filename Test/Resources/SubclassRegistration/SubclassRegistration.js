var SubclassRegistration;
(function (SubclassRegistration) {
    var ƒ = FudgeCore;
    // ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL | ƒ.DEBUG_FILTER.SOURCE);
    test(ƒ.Shader);
    test(ƒ.Mesh);
    test(ƒ.Component);
    test(ƒ.Joint);
    function test(_class) {
        console.group(_class.name);
        //@ts-ignore
        for (let subclass of _class.subclasses)
            log(subclass, _class);
        console.groupEnd();
    }
    function log(_class, _baseclass) {
        let instance;
        let color = "black";
        let message = "";
        if (_class["baseClass"] != _baseclass)
            color = "grey";
        try {
            // @ts-ignore
            instance = new _class();
        }
        catch (_error) {
            message = _error.message;
            color = "darkred";
        }
        console.groupCollapsed(`%c${_class.name}`, `color: ${color}`);
        console.dir(_class);
        console.dir(instance);
        if (message)
            console.warn(message);
        console.groupEnd();
    }
})(SubclassRegistration || (SubclassRegistration = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ViY2xhc3NSZWdpc3RyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTdWJjbGFzc1JlZ2lzdHJhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLG9CQUFvQixDQXNDN0I7QUF0Q0QsV0FBVSxvQkFBb0I7SUFDNUIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLGlGQUFpRjtJQUVqRixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2YsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNiLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVkLFNBQVMsSUFBSSxDQUFDLE1BQWdCO1FBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLFlBQVk7UUFDWixLQUFLLElBQUksUUFBUSxJQUFJLE1BQU0sQ0FBQyxVQUFVO1lBQ3BDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxTQUFTLEdBQUcsQ0FBQyxNQUFnQixFQUFFLFVBQW9CO1FBQ2pELElBQUksUUFBZ0IsQ0FBQztRQUNyQixJQUFJLEtBQUssR0FBVyxPQUFPLENBQUM7UUFDNUIsSUFBSSxPQUFPLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFVBQVU7WUFDbkMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUNqQixJQUFJLENBQUM7WUFDSCxhQUFhO1lBQ2IsUUFBUSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUFDLE9BQU8sTUFBTSxFQUFFLENBQUM7WUFDaEIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDekIsS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUNwQixDQUFDO1FBRUQsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxVQUFVLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDOUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RCLElBQUksT0FBTztZQUNULE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3JCLENBQUM7QUFDSCxDQUFDLEVBdENTLG9CQUFvQixLQUFwQixvQkFBb0IsUUFzQzdCIn0=