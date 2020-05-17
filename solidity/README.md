# run:  
truffle compile   
and    
truffle migrate  

The source code is inside the contracts folder  
The flat source code is 'LLCFlattened.sol'  
The deployment should be in two step:  
```
After truffle migrate:
the address of LoveLockBase: AddressA
the address of SaleLoveLock: AddressB
# bind the address of 'SaleContract'
call setSaleContractAddress(AddressB) in smart contract 'LoveLockBase'

and then 
# bind the address of 'LoveLockBase'
call LoveLockBase(AddressA) in smart contract 'SaleLoveLock'

then two smart contracts are connected.  

```

