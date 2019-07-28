package main

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/hreeder/evept/util/common"
	"github.com/hreeder/evept/services/skillpath"
)

func main() {
	sp := skillpath.GetSkillPath(common.GetDBConfig())
	sp.GetFrom(23919)
}
