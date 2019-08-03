package main

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/hreeder/evept/pkg/skillpath"
	"github.com/hreeder/evept/pkg/util/common"
)

func main() {
	sp := skillpath.GetSkillPath(common.GetDBConfig())
	sp.GetFrom(23919)
}
