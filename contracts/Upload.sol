// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Upload {

    // Struct to represent access information for a user.
    struct Access {
        address user; // Address of the user who was given access.
        bool access;   // Boolean indicating whether access is granted (1) or not (0).
    }

    // Map to store URLs of the files associated with user addresses. The files that the user uploaded
    mapping(address => string[]) value;

    // Mapping to track ownership of data between users.
    mapping(address => mapping(address => bool)) ownership; // Map row address col

    // Mapping to maintain a list of users who were given access to data.
    mapping(address => Access[]) accessList; // Access list to maintain a list of users who were given access.

    // Mapping to track previous data access state.
    mapping(address => mapping(address => bool)) previousData; // Previous data access state.

    // Function to add a URL associated with the user's address.
    function add(address _user, string memory url) external {
        value[_user].push(url);
    }

    // Function to allow another user access to the sender's data.
    function allow(address user) external {
        ownership[msg.sender][user] = true;

        // If the sender had previously given access to the user, update the access state.
        if (previousData[msg.sender][user]) {
            for (uint i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == user) {
                    accessList[msg.sender][i].access = true;
                }
            }
        } else {
            // If it's a new access grant, add the user to the access list.
            accessList[msg.sender].push(Access(user, true));
            previousData[msg.sender][user] = true;
        }
    }

    // Function to disallow access to another user.
    function disallow(address user) public {
        ownership[msg.sender][user] = false;

        // Update the access state in the access list.
        for (uint i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == user) {
                accessList[msg.sender][i].access = false;
            }
        }
    }

    // Function to display URLs associated with a user's address.
    function display(address _user) external view returns (string[] memory) {
        // Require that the caller has access to the user's data or is the owner of the data.
        require(_user == msg.sender || ownership[_user][msg.sender], "You don't have access");
        return value[_user];
    }

    // Function to share the access list of users who were given access to the sender's data.
    function shareAccess() public view returns (Access[] memory) {
        return accessList[msg.sender];
    }
}
